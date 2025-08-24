import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getAIResponse } from "../services/aiProvider.js";
import { createRoadmap, getRoadmap, createProjects, getProjects, createMock, getMock } from "../controllers/aiController.js";

const router = express.Router();

router.get("/ping", auth, async (req, res) => {
  try {
    const { text, provider, model } = await getAIResponse('{"ok":true}', { json: true });
    res.json({ provider, model, raw: text });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Roadmap
router.get("/roadmap", auth, getRoadmap);
router.post("/roadmap", auth, createRoadmap);

// Projects
router.get("/projects", auth, getProjects);
router.post("/projects", auth, createProjects);

// Mock interview
router.get("/mock", auth, getMock);
router.post("/mock", auth, createMock);

export default router;
