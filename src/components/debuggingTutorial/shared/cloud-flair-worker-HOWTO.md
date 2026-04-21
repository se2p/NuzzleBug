

---

## Cloudflare Worker Implementation
This guide describes how to implement a proxy using Cloudflare Workers to forward the LLM hint requests from the frontend to the OpenAI API.


### Deployment Steps
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application**.
3. Create and set the global variable OPENAI_API_KEY
4. Create a new Worker and paste the following code into the editor.
5. Change "const apiUrl = [cloudFlairWorkerURL];" in hint-generation.js to your new URL.

### Worker Script (`index.js`)
```javascript
/**
 * Generates CORS headers to allow cross-origin requests from your frontend.
 */
function makeCors(request) {
  const reqHeaders = request.headers.get("Access-Control-Request-Headers");
  return {
    "Access-Control-Allow-Origin": "*", // Change to your domain in production
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": reqHeaders || "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin, Access-Control-Request-Headers",
  };
}

export default {
  async fetch(request, env) {
    const cors = makeCors(request);

    // 1. Handle Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // 2. Restrict to POST
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors });
    }

    try {
      const body = await request.text();

      // 3. Forward to OpenAI
      const upstream = await fetch("[https://api.openai.com/v1/chat/completions](https://api.openai.com/v1/chat/completions)", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body,
      });

      // 4. Prepare Streaming Response
      const headers = new Headers(cors);
      headers.set("Content-Type", upstream.headers.get("content-type") || "text/event-stream");
      headers.set("Cache-Control", "no-cache");

      return new Response(upstream.body, {
        status: upstream.status,
        headers
      });

    } catch (e) {
      const headers = new Headers(cors);
      headers.set("Content-Type", "text/plain; charset=utf-8");
      return new Response(`Worker error: ${String(e?.message || e)}`, {
        status: 500,
        headers
      });
    }
  },
};
```
