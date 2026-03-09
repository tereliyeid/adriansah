export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  const response = await next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  const apiKey = env.DEEPSEEK_API_KEY || '';

  const inject = `<script>window.__DEEPSEEK_KEY=${JSON.stringify(apiKey)};</script>`;

  const originalHtml = await response.text();
  const modifiedHtml = originalHtml.replace('</head>', inject + '</head>');

  return new Response(modifiedHtml, {
    status: response.status,
    headers: response.headers,
  });
}