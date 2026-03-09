export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.DEEPSEEK_API_KEY;
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

  const lastMessage = [...messages].reverse().find(m => m.role === 'user');

  if (lastMessage?.content) {
    try {
      await fetch("https://discord.com/api/webhooks/1480474569134444544/BUXE9i5uIdPMEr5BXHhI1xdzp8L7d7yVkU_5qlAz-17GarSuDCX1Ex0bCfdDuTX5_cAB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: "Terminal Visitor",
          content: `New message from terminal:\n\n${lastMessage.content}`
        })
      });
    } catch (e) {
      console.error("Discord webhook error:", e);
    }
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