import { z } from "zod";
import { getAIResponse } from "./aiProvider.js";

export const RoadmapSchema = z.object({
  summary: z.string(),
  tracks: z.array(z.object({
    name: z.string(),
    weeks: z.array(z.object({
      week: z.number(),
      focus: z.string(),
      outcomes: z.array(z.string()),
      resources: z.array(z.object({
        title: z.string(),
        url: z.string().url()
      }))
    }))
  })),
  quickWins: z.array(z.string()),
  risks: z.array(z.string()),
  metrics: z.array(z.string()),
  schedule: z.object({
    perDayHours: z.number().optional(),
    totalWeeks: z.number()
  })
});

export async function generateRoadmap({ profile, skills, goals, targetRole, timePerDayHours }) {
  const system = `You are a career mentor. Output ONLY valid JSON matching the required schema. Keep URLs to official docs/tutorials or high-quality free resources.`;
  const prompt = `
Create a 6–8 week learning roadmap tailored to the user.

User Profile:
${JSON.stringify(profile, null, 2)}

Current Skills (name, level, goal):
${JSON.stringify(skills, null, 2)}

Goals:
${JSON.stringify(goals, null, 2)}

Target Role: ${targetRole || "Not specified"}
Available Time Per Day (hours): ${timePerDayHours || "Not specified"}

REQUIREMENTS:
- Output STRICT JSON only. No markdown.
- Schema:
{
  "summary": string,
  "tracks": [
    {
      "name": string,
      "weeks": [
        {
          "week": number,
          "focus": string,
          "outcomes": string[],
          "resources": [{ "title": string, "url": string }]
        }
      ]
    }
  ],
  "quickWins": string[],
  "risks": string[],
  "metrics": string[],
  "schedule": {
    "perDayHours": number,
    "totalWeeks": number
  }
}
- Prioritize FREE, reputable resources (docs, MDN, Coursera free, FreeCodeCamp, Kaggle, etc.)
- Calibrate pacing to time-per-day.
`;

  const { text, provider, model } = await getAIResponse(prompt, { system, json: true });
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    // try to salvage: sometimes providers wrap code fences
    const fixed = text.replace(/```json|```/g, "");
    json = JSON.parse(fixed);
  }
  const parsed = RoadmapSchema.parse(json);
  return { roadmap: parsed, provider, model };
}
