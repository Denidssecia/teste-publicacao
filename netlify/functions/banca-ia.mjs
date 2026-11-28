// Banca de Ideias: repassa o pedido do app para o Claude pelo AI Gateway do Netlify
// (sem chave própria; o gateway injeta ANTHROPIC_API_KEY e ANTHROPIC_BASE_URL).
// Devolve só o texto da resposta, em streaming, para não estourar o tempo limite.
const env = (k) => (globalThis.Netlify?.env?.get(k)) ?? process.env[k];
const MODELOS = ["claude-sonnet-5-5", "claude-sonnet-4-5"];

export default async (req) => {
  if (req.method !== "POST") return new Response("Use POST", { status: 405 });
  const key = env("ANTHROPIC_API_KEY");
  const base = (env("ANTHROPIC_BASE_URL") || "https://api.anthropic.com").replace(/\/+$/, "").replace(/\/v1$/, "");
  if (!key) return new Response("IA não configurada no Netlify (AI Gateway inativo).", { status: 503 });

  let body;
  try { body = await req.json(); } catch { return new Response("JSON inválido", { status: 400 }); }
  const prompt = String(body?.prompt || "");
  if (prompt.length < 20 || prompt.length > 60000) return new Response("Pedido inválido", { status: 400 });
  const longo = body?.tier === "complex";

  let r = null, erro = "";
  for (const model of MODELOS) {
    r = await fetch(base + "/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model, max_tokens: longo ? 5000 : 3000, stream: true,
        system: "Responda sempre em português do Brasil. Quando o pedido pedir JSON, responda somente com o JSON, sem texto antes ou depois.",
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (r.ok) break;
    erro = (await r.text()).slice(0, 300);
    if (!(r.status === 404 || (r.status === 400 && /model/i.test(erro)))) break;
  }
  if (!r || !r.ok) return new Response("Erro da IA: " + erro, { status: 502 });

  const dec = new TextDecoder(), enc = new TextEncoder();
  const reader = r.body.getReader();
  let resto = "";
  const stream = new ReadableStream({
    async pull(ctrl) {
      const { done, value } = await reader.read();
      if (done) { ctrl.close(); return; }
      resto += dec.decode(value, { stream: true });
      const linhas = resto.split("\n");
      resto = linhas.pop();
      for (const l of linhas) {
        if (!l.startsWith("data:")) continue;
        try {
          const ev = JSON.parse(l.slice(5).trim());
          if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") ctrl.enqueue(enc.encode(ev.delta.text));
          if (ev.type === "error") ctrl.enqueue(enc.encode("\n[[ERRO]]"));
        } catch { /* linha incompleta */ }
      }
    },
    cancel() { reader.cancel(); }
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
};

export const config = {
  path: "/api/banca",
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] }
};
