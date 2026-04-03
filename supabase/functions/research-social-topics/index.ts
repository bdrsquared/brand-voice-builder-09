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
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
    if (!PERPLEXITY_API_KEY) throw new Error('PERPLEXITY_API_KEY not configured')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verify auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) throw new Error('Unauthorized')

    const { data: hasAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
    if (!hasAdmin) throw new Error('Admin access required')

    const { team_member_id, custom_topic, research_focus } = await req.json()
    if (!team_member_id) throw new Error('team_member_id is required')

    // Fetch team member
    const { data: member, error: memberError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', team_member_id)
      .single()
    if (memberError || !member) throw new Error('Team member not found')

    const topicArea = custom_topic || (member.interests ? `Topics related to: ${member.interests}` : 'general professional content')
    
    const focusGuidance = research_focus
      ? `The user has asked for specific focus on: "${research_focus}".`
      : `Default focus: hot takes, edge cases, contrarian opinions, important trends, practical business implications.`

    const prompt = `Research the topic: "${topicArea}" for a ${member.position} professional${member.description ? ` who ${member.description}` : ''}.

${focusGuidance}

IMPORTANT: Do NOT use any sources from earworm.co.uk, earwormmedia.com, or any Earworm-owned domains. Only use external, third-party sources.

Find 5 strong LinkedIn content angles based on:
- current hot takes and emerging debates
- interesting edge cases and non-obvious use cases
- controversial or non-consensus opinions
- meaningful business implications
- strategic insights for operators, founders, marketers, or B2B leaders

Prioritise larger, credible sources — avoid generic SEO roundups. Use a mix of major publications, research firms, company blogs, industry analysis, and respected expert commentary.

For each angle, provide:
- A sharp, specific title/hook (not a broad topic — an actual post angle someone would write)
- A 2-4 sentence angle summary explaining the idea and why it's interesting
- Why this matters right now (1-2 sentences)
- The most interesting non-obvious insight
- A suggested LinkedIn stance: practical, contrarian, strategic, cautionary, or opinion-led
- 2-4 supporting source URLs with short descriptions
- Whether this is news-based (tied to a specific recent event) or general thought leadership

BAD title examples: "AI in marketing", "The future of content"
GOOD title examples: "AI won't replace content teams — it will expose weak strategy faster", "The biggest missed AI use case in content is not writing, it's judgement"

Return a JSON array with exactly 5 objects:
[
  {
    "title": "Sharp punchy hook that could be a LinkedIn first line",
    "angle_summary": "2-4 sentences explaining the idea, the angle, and why it's interesting",
    "why_now": "1-2 sentences on why this matters right now",
    "non_obvious_insight": "The most interesting non-obvious takeaway",
    "suggested_stance": "practical|contrarian|strategic|cautionary|opinion-led",
    "topic_type": "news|general",
    "sources": [
      { "url": "https://...", "title": "Source title", "description": "Brief description of what this source says" }
    ]
  }
]

Return ONLY the JSON array, no other text.`

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are a sharp LinkedIn content strategist who finds non-obvious angles. Return only valid JSON arrays. Prioritise credible, larger sources.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Perplexity API error [${response.status}]: ${errText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('Failed to parse topics from AI response')
    
    const topics = JSON.parse(jsonMatch[0])

    // Insert topics with rich research data
    const topicsToInsert = topics.map((t: any) => ({
      team_member_id,
      title: t.title,
      description: t.angle_summary || t.description,
      topic_type: t.topic_type === 'news' ? 'news' : 'general',
      source_url: t.sources?.[0]?.url || null,
      status: 'new',
      research_data: {
        angle_summary: t.angle_summary,
        why_now: t.why_now,
        non_obvious_insight: t.non_obvious_insight,
        suggested_stance: t.suggested_stance,
        sources: t.sources || [],
      },
    }))

    const { error: insertError } = await supabase
      .from('social_post_topics')
      .insert(topicsToInsert)
    if (insertError) throw new Error(`Failed to save topics: ${insertError.message}`)

    return new Response(JSON.stringify({ success: true, topics: topicsToInsert }), {
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
