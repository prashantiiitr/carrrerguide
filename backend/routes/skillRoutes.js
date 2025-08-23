import express from "express";
import Skill from "../models/Skill.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, level, goal } = req.body;
    const skill = await Skill.create({
      user: req.user.id,
      name,
      level,
      goal,
    });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
