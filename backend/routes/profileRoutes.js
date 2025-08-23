import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.route("/")
  .post(authMiddleware, createProfile)
  .get(authMiddleware, getMyProfile)
  .put(authMiddleware, updateProfile)
  .delete(authMiddleware, deleteProfile);

export default router;
