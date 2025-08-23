import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes protected by authMiddleware
router.route("/")
  .post(authMiddleware, createGoal)
  .get(authMiddleware, getGoals);

router.route("/:id")
  .put(authMiddleware, updateGoal)
  .delete(authMiddleware, deleteGoal);

export default router;
