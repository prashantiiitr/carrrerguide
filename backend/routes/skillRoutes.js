import express from "express";
import Skill from "../models/Skill.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc Add new skill
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

// @desc Get all skills for logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update skill
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

// @desc Delete skill
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
