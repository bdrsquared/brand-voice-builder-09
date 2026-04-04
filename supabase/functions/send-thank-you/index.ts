import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const BodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, email } = parsed.data;
    const firstName = name.split(' ')[0];

    // 1. Add contact to Resend Audience
    const audienceId = '66c1145f-2fbd-40e4-be43-920eec445936';
    try {
      const audienceRes = await fetch(`${GATEWAY_URL}/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': RESEND_API_KEY,
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          unsubscribed: false,
        }),
      });

      if (!audienceRes.ok) {
        const errText = await audienceRes.text();
        console.error(`Failed to add to audience [${audienceRes.status}]: ${errText}`);
      }
    } catch (audErr) {
      console.error('Audience add failed:', audErr);
    }

    // 2. Send thank you email
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
          
          <!-- Header accent -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#22c55e,#7c3aed,#3b82f6);"></td>
          </tr>
          
          <!-- Logo -->
          <tr>
            <td style="padding:32px 32px 0;">
              <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">earworm</span>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:24px 32px 32px;">
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Thanks for reaching out, ${firstName}.</h1>
              <p style="margin:0 0 16px;font-size:14px;color:#a1a1aa;line-height:1.7;">
                We've received your message and someone from the team will be in touch shortly.
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.7;">
                In the meantime, if you'd like to learn more about how we help brands build authority through video podcasting, take a look at our latest work.
              </p>
              <a href="https://earworm.co/case-studies" style="display:inline-block;background-color:#22c55e;color:#000000;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:999px;">
                View our work →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 28px;">
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 20px;" />
              <p style="margin:0;font-size:11px;color:#52525b;line-height:1.5;">
                Earworm Media · London, UK<br/>
                <a href="https://earworm.co" style="color:#52525b;text-decoration:underline;">earworm.co</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailRes = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'Earworm <hi@earworm.co>',
        to: [email],
        subject: `Thanks for getting in touch, ${firstName}`,
        html: emailHtml,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      throw new Error(`Resend email failed [${emailRes.status}]: ${errText}`);
    }

    const emailData = await emailRes.json();

    return new Response(JSON.stringify({ success: true, id: emailData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in send-thank-you:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
