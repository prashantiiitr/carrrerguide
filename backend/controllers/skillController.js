import Skill from "../models/Skill.js";

export const createSkill = async (req, res) => {
  try {
    const { name, level, goal } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const skill = await Skill.create({
      user: req.user._id,
      name,
      level,
      goal,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    skill.name = req.body.name || skill.name;
    skill.level = req.body.level || skill.level;
    skill.goal = req.body.goal || skill.goal;

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await skill.deleteOne();
    res.json({ message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
