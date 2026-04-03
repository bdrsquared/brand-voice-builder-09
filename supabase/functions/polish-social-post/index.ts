
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) throw new Error('Unauthorized')
    const { data: hasAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
    if (!hasAdmin) throw new Error('Admin access required')

    const { post_id } = await req.json()
    if (!post_id) throw new Error('post_id is required')

    const { data: post, error: postError } = await supabase
      .from('social_posts')
      .select('*, social_post_topics(*, team_members(*))')
      .eq('id', post_id)
      .single()
    if (postError || !post) throw new Error('Post not found')

    const member = post.social_post_topics?.team_members
    const topic = post.social_post_topics

    const systemPrompt = `You are a ruthless LinkedIn post editor. Your job is to take a draft LinkedIn post and make it sharper, punchier, and more human. You are not rewriting it from scratch - you are polishing it.

CRITICAL VOICE RULE:
- This post is written in FIRST PERSON. The writer is sharing their own thoughts, observations and experiences
- Use "I" freely. "I've seen this", "I keep noticing", "I don't buy it", "I've been thinking about this"
- It should read like personal musings - someone thinking out loud on LinkedIn, not presenting a report
- The writer has opinions and isn't afraid to state them as their own

HUMAN TOUCH:
- Occasionally echo or repeat a key phrase for emphasis. Like circling back to land the point
- e.g. "Your software is lying to you. Like, genuinely lying to you"
- e.g. "Nobody talks about this. Truly nobody"
- This isn't a bug - it's how people actually talk when they care about something
- Add small moments of self-awareness: "I know that sounds dramatic but...", "Look, I get it", "This sounds obvious. It isn't"

YOUR EDITORIAL CHECKLIST:

1. HOOK CHECK
- Is the first line genuinely arresting? Would YOU stop scrolling?
- If not, rewrite the hook. Make it specific, counterintuitive, or uncomfortably honest
- The hook should create a gap the reader needs to fill

2. CAPS & EMPHASIS
- Add strategic CAPS to 1-3 words maximum for emphasis on the most important point
- Don't overdo it. One well-placed CAPS word hits harder than five
- Use it for the word that carries the emotional weight of the sentence

3. IRREVERENCE & DRY WIT
- Is this too safe? Too polished? Too "LinkedIn"?
- Add a dry aside, a slightly uncomfortable observation, or a moment of "I probably shouldn't say this but..."
- The post should sound like someone who doesn't care about engagement metrics but gets them anyway

4. RAGE BAIT (subtle)
- Add ONE line that might make someone disagree enough to comment
- Not trolling - just a confident opinion stated without hedging
- Drop the qualifiers. "I think maybe" becomes "I think this is"
- State something the reader's boss probably believes that's wrong

5. FORMATTING FOR LINKEDIN
- Short paragraphs. 1-2 sentences max
- White space between every thought
- No walls of text
- Fragment sentences are fine. Encouraged, even
- Remove any remaining hashtags or emojis

6. ENDING
- Does it end too neatly? Undo that
- End mid-thought, with a question that doesn't beg for engagement, or with something slightly uncomfortable
- Never end with "What do you think?" or "Agree?"

7. LANGUAGE
- British English throughout
- Spaced hyphens ' - ' not em dashes
- No Oxford commas
- Kill any corporate jargon that survived the draft

RULES:
- Return ONLY the polished post text, nothing else
- Keep it under 1300 characters
- Don't add any meta-commentary about what you changed
- The output should feel like the same voice, just sharper`

    const userPrompt = `Here is the draft LinkedIn post to polish:

---
${post.content}
---

${member ? `Written for ${member.name}, a ${member.position} professional.` : ''}
${topic ? `Topic: ${topic.title}` : ''}

Polish this post following your editorial checklist. Return ONLY the polished post text.`

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited - please try again in a moment' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted - please top up' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      throw new Error(`AI error [${response.status}]: ${errText}`)
    }

    const data = await response.json()
    const polishedContent = data.choices?.[0]?.message?.content || ''

    // Update the post with polished content
    const { error: updateError } = await supabase
      .from('social_posts')
      .update({ content: polishedContent.trim(), updated_at: new Date().toISOString() })
      .eq('id', post_id)
    if (updateError) throw new Error(`Failed to save polished post: ${updateError.message}`)

    return new Response(JSON.stringify({ success: true, content: polishedContent.trim() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
