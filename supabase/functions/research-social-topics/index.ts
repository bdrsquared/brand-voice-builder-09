import { corsHeaders } from '@supabase/supabase-js/cors'
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

    const { team_member_id } = await req.json()
    if (!team_member_id) throw new Error('team_member_id is required')

    // Fetch team member
    const { data: member, error: memberError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', team_member_id)
      .single()
    if (memberError || !member) throw new Error('Team member not found')

    const prompt = `You are a LinkedIn content strategist. Research current topics for a ${member.position} professional${member.description ? ` who ${member.description}` : ''}.${member.interests ? ` Their interests include: ${member.interests}.` : ''}

Generate exactly 5 LinkedIn post topic ideas:
- 2 must be NEWS-BASED: tied to a specific current event, announcement, trend, or industry development from the last 7 days. Include the source URL.
- 3 must be GENERAL CONTENT: evergreen thought leadership, insights, or opinion pieces relevant to their role and interests.

Each topic should be specific enough to write a full LinkedIn post from. Include a compelling angle, not just a broad subject.

Return JSON array with exactly 5 objects:
[
  {
    "title": "Short punchy title",
    "description": "2-3 sentence description of the angle and key points to cover",
    "topic_type": "news" or "general",
    "source_url": "URL for news items, null for general"
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
          { role: 'system', content: 'You are a LinkedIn content strategist. Return only valid JSON arrays.' },
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

    // Insert topics
    const topicsToInsert = topics.map((t: any) => ({
      team_member_id,
      title: t.title,
      description: t.description,
      topic_type: t.topic_type === 'news' ? 'news' : 'general',
      source_url: t.source_url || null,
      status: 'new',
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
