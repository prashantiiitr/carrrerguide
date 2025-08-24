import { z } from "zod";
import { getAIResponse } from "./aiProvider.js";

export const ProjectsSchema = z.object({
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(["Beginner","Intermediate","Advanced"]),
    steps: z.array(z.string()).min(1),
    resources: z.array(z.object({ title: z.string(), url: z.string().url() }))
  })).min(3).max(6)
});

export async function generateProjects({ targetRole, skills }) {
  const system = `You are a pragmatic mentor. Output strict JSON only. Prefer free, high-quality resources.`;
  const prompt = `
Create 3–5 portfolio project ideas aligned to the target role. 
Keep ideas realistic and resume-worthy, each with implementation steps and free resources.

Target Role: ${targetRole || "Not specified"}
Current Skills: ${JSON.stringify(skills || [], null, 2)}

RESPONSE JSON SHAPE:
{
  "projects": [
    {
      "title": "string",
      "description": "string",
      "difficulty": "Beginner|Intermediate|Advanced",
      "steps": ["string", "..."],
      "resources": [{"title":"string","url":"https://..."}]
    }
  ]
}
Strict JSON only. No markdown.`;

  const { text, provider, model } = await getAIResponse(prompt, { system, json: true });
  let json;
  try { json = JSON.parse(text); }
  catch { json = JSON.parse(text.replace(/```json|```/g, "")); }

  const parsed = ProjectsSchema.parse(json);
  return { projectsDoc: parsed, provider, model };
}
