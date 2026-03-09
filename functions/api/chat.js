/**
 * Cloudflare Pages Function: /functions/api/chat.js
 *
 * Proxies requests to DeepSeek API so the API key stays server-side.
 * Set DEEPSEEK_API_KEY in CF Pages → Settings → Environment Variables.
 *
 * POST /api/chat  { messages: [...], model?: string }
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = 'sk-2576898ace1945e099d4089cad1e92cc';
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY not configured on server' }), {
      status: 500,
      headers: corsHeaders('application/json'),
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: corsHeaders('application/json'),
    });
  }

  const { messages, model = 'deepseek-chat', max_tokens = 512 } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages array required' }), {
      status: 400,
      headers: corsHeaders('application/json'),
    });
  }

  const upstream = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, max_tokens, stream: false }),
  });

  const data = await upstream.json();

  return new Response(JSON.stringify(data), {
    status: upstream.status,
    headers: corsHeaders('application/json'),
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function corsHeaders(contentType) {
  const h = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (contentType) h['Content-Type'] = contentType;
  return h;
}
