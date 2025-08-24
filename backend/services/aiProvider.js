import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

let openai = null;
let genAI = null;
let cachedProvider = null;
let cachedModel = null;

function resolveProviderAndModel(overrideModel) {
  if (!cachedProvider) {
    cachedProvider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  }
  if (!cachedModel) {
    cachedModel = cachedProvider === "openai"
      ? (process.env.OPENAI_MODEL || "gpt-4o-mini")
      : (process.env.GEMINI_MODEL || "gemini-1.5-flash");
  }
  return { provider: cachedProvider, model: overrideModel || cachedModel };
}

function ensureClient(provider) {
  if (provider === "openai") {
    if (!openai) {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error("OPENAI_API_KEY missing");
      openai = new OpenAI({ apiKey: key });
    }
  } else {
    if (!genAI) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error("GEMINI_API_KEY missing");
      genAI = new GoogleGenerativeAI(key);
    }
  }
}

/**
 * getAIResponse(prompt, opts) -> { text, provider, model }
 * opts: { model?, system?, json?: boolean, temperature? }
 */
export async function getAIResponse(prompt, opts = {}) {
  const json = opts.json ?? true;
  const temperature = typeof opts.temperature === "number" ? opts.temperature : 0.7; // bump randomness

  const { provider, model } = resolveProviderAndModel(opts.model);
  ensureClient(provider);

  if (provider === "openai") {
    const res = await openai.chat.completions.create({
      model,
      messages: [
        ...(opts.system ? [{ role: "system", content: opts.system }] : []),
        { role: "user", content: prompt }
      ],
      response_format: json ? { type: "json_object" } : undefined,
      temperature
    });
    const text = res.choices?.[0]?.message?.content || "";
    return { text, provider, model };
  } else {
    const genModel = genAI.getGenerativeModel({ model });
    const res = await genModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        responseMimeType: json ? "application/json" : undefined,
        temperature // <— now applied
      }
    });
    const text = res.response?.text() || "";
    return { text, provider, model };
  }
}
