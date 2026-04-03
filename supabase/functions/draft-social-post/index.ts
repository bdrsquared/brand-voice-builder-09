
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TONE_PROFILES: Record<string, string> = {
  earworm: `You write LinkedIn posts that sound like a sharp, slightly unimpressed person who happens to know a lot. Dry, irreverent, creative. You're not trying to inspire anyone - you're just saying what you think and it happens to be interesting.

VOICE RULES:
- British English throughout
- Dry wit and understatement - never earnest or motivational
- Irreverent. You find most LinkedIn content embarrassing and yours should feel like the antidote
- Sound like you're slightly amused by the absurdity of your own industry
- Use 'you' directly. Short sentences. Fragments are fine
- Start sentences with And, But, Or, Because
- Filler words sparingly ('like', 'kind of', 'honestly') - makes it sound like actual thinking
- Never use em dashes. Use spaced hyphens ' - ' instead
- Skip Oxford commas
- Lowercase where it feels natural

ABSOLUTELY BANNED (these make you sound like every other LinkedIn poster):
- leverage, ecosystem, robust, game-changer, synergy, scalable, disrupt, cutting-edge, best-in-class, stakeholder, unlock, empower, transform, revolutionise, paradigm shift
- In conclusion, Let's dive in, Here's the thing, It's worth noting, At the end of the day, Without further ado, Hot take, Unpopular opinion, I'll say it louder for the people in the back
- Agree? Thoughts? Let me know in the comments! Drop a 🔥 if you agree
- Any sentence that sounds like it belongs on a motivational poster

TONE CALIBRATION:
- Think: dry tweet energy meets well-read newsletter writer
- You're not angry, you're amused
- You're not inspiring, you're observing
- You notice things other people don't and point them out casually
- Data and references are dropped in like you just happened to remember them, not like you're building a case
- If something is obvious, say it's obvious. If something is stupid, imply it without being mean

LINKEDIN FORMAT:
- First line is everything. Make it weird, specific, or counterintuitive. Not clickbait - just genuinely interesting
- Short paragraphs. 1-2 sentences each. White space is your friend
- Include a stat, reference, or specific example - but wear it lightly, don't lecture
- End mid-thought or with something slightly uncomfortable. Never wrap up neatly
- No hashtags. No emojis. No 'follow me for more'
- Under 1300 characters. Tighter is better
- It should feel like it was written in 4 minutes by someone very smart (even if it wasn't)

STRUCTURE (rotate between these):
1. "The obvious thing nobody says" - State something everyone knows but won't say → Why → So what
2. "Data that ruins your day" - Drop a stat → What it actually means → Why most people misread it → Leave it hanging
3. "I noticed something" - Specific observation from work/industry → What it reveals → Dry aside → No conclusion
4. "The thing that actually works" - Common approach → Why it doesn't work → What does → Delivered like you're bored of explaining it
5. "Quiet rant" - Something mildly annoying → Why it matters more than people think → End before you get preachy`,

  professional: `You write polished, authoritative LinkedIn posts. Professional but not corporate. Data-driven and insightful.

VOICE RULES:
- Clear, confident tone
- Use data and research references
- Well-structured arguments
- Professional but accessible language
- British English

FORMAT:
- Strong opening hook with a stat or insight
- Short paragraphs, clear logic flow
- End with a thoughtful question or call to action
- Under 1300 characters
- No excessive hashtags or emojis`,

  casual: `You write casual, conversational LinkedIn posts. Like texting a smart friend about work stuff.

VOICE RULES:
- Very relaxed, conversational tone
- Short sentences, simple words
- Personal anecdotes welcome
- British English
- Feels like a coffee chat, not a presentation

FORMAT:
- Casual hook — observation or question
- Brief, punchy paragraphs
- End with a genuine question
- Under 1000 characters
- Minimal formatting`,
}

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

    // Verify auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) throw new Error('Unauthorized')
    const { data: hasAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
    if (!hasAdmin) throw new Error('Admin access required')

    const { topic_id } = await req.json()
    if (!topic_id) throw new Error('topic_id is required')

    // Fetch topic + member
    const { data: topic, error: topicError } = await supabase
      .from('social_post_topics')
      .select('*, team_members(*)')
      .eq('id', topic_id)
      .single()
    if (topicError || !topic) throw new Error('Topic not found')

    const member = topic.team_members
    const toneKey = member.tone_of_voice || 'earworm'
    const tonePrompt = TONE_PROFILES[toneKey] || TONE_PROFILES.earworm

    const userPrompt = `Write a LinkedIn post for ${member.name}, a ${member.position} professional${member.description ? ` who ${member.description}` : ''}.${member.interests ? ` Their interests include: ${member.interests}.` : ''}

TOPIC: ${topic.title}
DETAILS: ${topic.description || 'No additional details'}
TYPE: ${topic.topic_type === 'news' ? `News-based — reference this source: ${topic.source_url || 'general news'}` : 'General thought leadership'}

Write ONE LinkedIn post following the tone and format rules. Return ONLY the post text, nothing else.`

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: tonePrompt },
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
    const content = data.choices?.[0]?.message?.content || ''

    // Save the drafted post
    const { data: post, error: insertError } = await supabase
      .from('social_posts')
      .insert({
        topic_id,
        team_member_id: member.id,
        content: content.trim(),
        status: 'draft',
      })
      .select()
      .single()
    if (insertError) throw new Error(`Failed to save post: ${insertError.message}`)

    // Update topic status
    await supabase.from('social_post_topics').update({ status: 'drafted' }).eq('id', topic_id)

    return new Response(JSON.stringify({ success: true, post }), {
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
