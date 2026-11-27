export default async (req) => {
  if (req.method !== "POST") return new Response("Use POST", { status: 405 });
  const pin = Netlify.env.get("PAINEL_PIN") || "";
  if (pin && req.headers.get("x-painel-pin") !== pin) return new Response("PIN incorreto", { status: 401 });
  const key = Netlify.env.get("ELEVENLABS_API_KEY");
  const voz = Netlify.env.get("ELEVENLABS_VOICE_ID") || "u7N1p4OIOc6Fl7y72WE7";
  if (!key || !voz) return new Response("Voz não configurada", { status: 503 });
  let text = "";
  try { ({ text } = await req.json()); } catch { return new Response("JSON inválido", { status: 400 }); }
  if (!text || text.length > 1500) return new Response("Texto inválido", { status: 400 });
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", language_code: "pt",
      voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true } })
  });
  if (!r.ok) return new Response("Erro ElevenLabs: " + (await r.text()).slice(0, 300), { status: 502 });
  return new Response(r.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
};
