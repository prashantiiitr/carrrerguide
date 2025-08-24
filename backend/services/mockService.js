import { z } from "zod";
import { getAIResponse } from "./aiProvider.js";

export const MockSchema = z.object({
  technical: z.array(z.object({ question: z.string(), answer: z.string() })).min(1).max(20),
  behavioral: z.array(z.object({ question: z.string(), answer: z.string() })).min(1).max(20)
});

const LEVEL_GUIDANCE = {
  Startup: `Focus on practical problem-solving, speed of execution, JS/React fundamentals, REST, simple DB schemas, debugging.`,
  Mid: `Balance fundamentals and practical depth: performance, testing, modular architecture, DB indexing, API design, caching basics.`,
  MNC: `Emphasize CS fundamentals, complexity, OO design, concurrency basics, DB transactions, scalable services, test strategy, security.`,
  FAANG: `Emphasize DSA (graphs, DP, trees), system design depth (scalability, consistency, sharding, queues), performance tuning, edge cases.`
};

export async function generateMock({
  targetRole,
  seniority = "Junior",
  numTechnical = 6,
  numBehavioral = 4,
  companyLevel = "Startup",
  previousQuestions = [],   // <— NEW
  temperature = 0.8         // <— default more random
}) {
  const system = `You are an interviewer. Output STRICT JSON only matching the schema. Keep answers concise (2–5 sentences).`;
  const levelText = LEVEL_GUIDANCE[companyLevel] || LEVEL_GUIDANCE.Startup;
  const nonce = Math.random().toString(36).slice(2); // <— cache-busting

  const prompt = `
NONCE: ${nonce}

Generate mock interview Q&A sets.

Target Role: ${targetRole || "Not specified"}
Seniority: ${seniority}
Company Level: ${companyLevel}

Guidance by level:
${levelText}

AVOID repeating or paraphrasing any of these prior questions (hard constraint):
${JSON.stringify(previousQuestions, null, 2)}

REQUIREMENTS:
- Produce EXACTLY ${numTechnical} technical and EXACTLY ${numBehavioral} behavioral questions.
- Make them distinct from the prior list, and diverse across subtopics.
- Keep answers crisp and actionable.
- Return STRICT JSON ONLY:

{
  "technical": [{"question":"string","answer":"string"}],
  "behavioral": [{"question":"string","answer":"string"}]
}
`;

  const { text, provider, model } = await getAIResponse(prompt, {
    system,
    json: true,
    temperature
  });

  let json;
  try { json = JSON.parse(text); }
  catch { json = JSON.parse(text.replace(/```json|```/g, "")); }

  const parsed = MockSchema.parse(json);

  // Enforce requested counts without crashing (slice)
  const tech = Array.isArray(parsed.technical) ? parsed.technical.slice(0, numTechnical) : [];
  const beh  = Array.isArray(parsed.behavioral) ? parsed.behavioral.slice(0, numBehavioral) : [];

  return {
    mockDoc: { technical: tech, behavioral: beh },
    provider,
    model
  };
}
