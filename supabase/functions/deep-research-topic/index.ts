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

    const { topic_id } = await req.json()
    if (!topic_id) throw new Error('topic_id is required')

    // Fetch topic with research data
    const { data: topic, error: topicError } = await supabase
      .from('social_post_topics')
      .select('*, team_members(*)')
      .eq('id', topic_id)
      .single()
    if (topicError || !topic) throw new Error('Topic not found')

    const member = topic.team_members
    const researchData = topic.research_data as any

    const contextParts = [
      `Title/Hook: "${topic.title}"`,
      researchData?.angle_summary ? `Angle: ${researchData.angle_summary}` : '',
      researchData?.why_now ? `Why now: ${researchData.why_now}` : '',
      researchData?.non_obvious_insight ? `Key insight: ${researchData.non_obvious_insight}` : '',
      topic.description ? `Description: ${topic.description}` : '',
    ].filter(Boolean).join('\n')

    const prompt = `Deeply research this LinkedIn post angle for a ${member.position} professional${member.description ? ` who ${member.description}` : ''}:

${contextParts}

IMPORTANT: Do NOT use any sources from earworm.co.uk, earwormmedia.com, or any Earworm-owned domains. Only use external, third-party sources.

Provide a comprehensive research pack that will help someone write a high-quality LinkedIn post (not an academic report). Include:

1. CORE THESIS: The central argument or observation in 1-2 sentences
2. MAINSTREAM VIEW: What most people think about this topic (1-2 sentences)
3. WHAT MAKES THIS INTERESTING: Why this angle is different or worth writing about (2-3 sentences)
4. SUPPORTING ARGUMENTS: 3-5 strongest arguments or evidence points that back this angle
5. COUNTERARGUMENTS & CAVEATS: 2-3 strongest opposing views or important nuances
6. EXAMPLES & PROOF POINTS: 3-5 specific examples, case studies, anecdotes, or data points
7. SOURCES: 5-10 credible sources with URLs and brief descriptions
8. POST DIRECTIONS: 3 possible positions the writer could take:
   - Practical/operator-led (how-to, from-the-trenches)
   - Contrarian/opinion-led (challenging consensus)
   - Strategic/big-picture (industry implications)

Prioritise credible, larger sources. Avoid fluff and repeated points. Summarise carefully.

Return as a JSON object:
{
  "core_thesis": "...",
  "mainstream_view": "...",
  "what_makes_interesting": "...",
  "supporting_arguments": ["...", "..."],
  "counterarguments": ["...", "..."],
  "examples": [
    { "title": "...", "detail": "..." }
  ],
  "sources": [
    { "url": "...", "title": "...", "description": "..." }
  ],
  "post_directions": [
    { "type": "practical", "description": "..." },
    { "type": "contrarian", "description": "..." },
    { "type": "strategic", "description": "..." }
  ]
}

Return ONLY the JSON object, no other text.`

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: 'You are a deep research analyst for LinkedIn content. Return only valid JSON objects. Be thorough but concise. Prioritise substance over volume.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Perplexity API error [${response.status}]: ${errText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Failed to parse deep research from AI response')
    
    const deepResearch = JSON.parse(jsonMatch[0])

    // Save deep research data to topic
    const { error: updateError } = await supabase
      .from('social_post_topics')
      .update({ 
        deep_research_data: deepResearch,
        updated_at: new Date().toISOString()
      })
      .eq('id', topic_id)
    if (updateError) throw new Error(`Failed to save deep research: ${updateError.message}`)

    return new Response(JSON.stringify({ success: true, deep_research: deepResearch }), {
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
