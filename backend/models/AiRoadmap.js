import mongoose from "mongoose";

const aiRoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    input: {
      profile: { bio: String, location: String, website: String },
      skills: [{ name: String, level: String, goal: String }],
      goals: [{ title: String, description: String, targetDate: Date }],
      targetRole: String,
      timePerDayHours: Number
    },
    roadmap: mongoose.Schema.Types.Mixed, // JSON object
    provider: { type: String, enum: ["openai", "gemini"], required: true },
    model: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("AiRoadmap", aiRoadmapSchema);
