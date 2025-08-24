import AiRoadmap from "../models/AiRoadmap.js";
import AiProjects from "../models/AiProjects.js";
import AiMock from "../models/AiMock.js";
import { generateRoadmap } from "../services/roadmapService.js";
import { generateProjects } from "../services/projectService.js";
import { generateMock } from "../services/mockService.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Goal from "../models/Goal.js";

export async function getRoadmap(req, res) {
  try {
    const latest = await AiRoadmap.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(latest || null);
  } catch (e) { res.status(500).json({ message: e.message }); }
}
export async function createRoadmap(req, res) {
  try {
    let { targetRole, timePerDayHours, useDb = true, input } = req.body;
    let profile, skills, goals;
    if (useDb) {
      profile = await Profile.findOne({ user: req.user._id }) || {};
      skills = await Skill.find({ user: req.user._id });
      goals  = await Goal.find({ user: req.user._id });
    } else {
      ({ profile, skills, goals } = input || {});
    }
    const { roadmap, provider, model } = await generateRoadmap({ profile, skills, goals, targetRole, timePerDayHours });
    const doc = await AiRoadmap.create({ user: req.user._id, input: { profile, skills, goals, targetRole, timePerDayHours }, roadmap, provider, model });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ message: e.message }); }
}


export async function getProjects(req, res) {
  try {
    const latest = await AiProjects.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(latest || null);
  } catch (e) { res.status(500).json({ message: e.message }); }
}
export async function createProjects(req, res) {
  try {
    let { targetRole, useDb = true, inputSkills } = req.body;
    let skills;
    if (useDb) {
      const s = await Skill.find({ user: req.user._id });
      skills = s.map(x => ({ name: x.name, level: x.level }));
    } else {
      skills = inputSkills || [];
    }
    const { projectsDoc, provider, model } = await generateProjects({ targetRole, skills });
    const doc = await AiProjects.create({ user: req.user._id, input: { targetRole, skills }, projects: projectsDoc.projects, provider, model });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ message: e.message }); }
}

export async function getMock(req, res) {
  try {
    const latest = await AiMock.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(latest || null);
  } catch (e) { res.status(500).json({ message: e.message }); }
}



export async function createMock(req, res) {
  try {
    const {
      targetRole,
      seniority = "Junior",
      numTechnical = 6,
      numBehavioral = 4,
      companyLevel = "Startup"
    } = req.body;

    // Fetch last few mocks to avoid repeats
    const recent = await AiMock.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);

    const previousQuestions = [];
    for (const d of recent) {
      d?.mock?.technical?.forEach(q => q?.question && previousQuestions.push(q.question));
      d?.mock?.behavioral?.forEach(q => q?.question && previousQuestions.push(q.question));
    }

    const { mockDoc, provider, model } = await generateMock({
      targetRole,
      seniority,
      numTechnical: Number(numTechnical),
      numBehavioral: Number(numBehavioral),
      companyLevel,
      previousQuestions,
      temperature: 0.8 // tweak 0.6–1.0 for more/less variety
    });

    const doc = await AiMock.create({
      user: req.user._id,
      input: { targetRole, seniority, numTechnical, numBehavioral, companyLevel },
      mock: mockDoc,
      provider,
      model
    });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

