import Goal from "../models/goal.js";   // updated import ✅

// @desc    Create new goal
export const createGoal = async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;

    const goal = await Goal.create({
      user: req.user.id,
      title,
      description,
      targetDate,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all goals of logged-in user
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update goal
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await goal.deleteOne();
    res.json({ message: "Goal removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
