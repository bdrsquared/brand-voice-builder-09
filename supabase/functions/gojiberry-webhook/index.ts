import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();

    // Support both single contact and array of contacts from Zapier
    const contacts = Array.isArray(body) ? body : [body];

    const rows = contacts.map((c: Record<string, unknown>) => ({
      email: (c.email as string || '').trim().toLowerCase(),
      first_name: (c.first_name as string || c.firstName as string || c.name as string || '').trim() || null,
      last_name: (c.last_name as string || c.lastName as string || '').trim() || null,
      company: (c.company as string || c.organization as string || '').trim() || null,
      job_title: (c.job_title as string || c.jobTitle as string || c.title as string || c.position as string || '').trim() || null,
      linkedin_url: (c.linkedin_url as string || c.linkedinUrl as string || c.linkedin as string || '').trim() || null,
      source: (c.source as string || 'gojiberry').trim(),
      raw_data: c,
    })).filter((r: { email: string }) => r.email && r.email.includes('@'));

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid contacts provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase
      .from('gojiberry_contacts')
      .upsert(rows, { onConflict: 'email', ignoreDuplicates: true });

    if (error) {
      console.error('DB error:', error);
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ success: true, imported: rows.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
