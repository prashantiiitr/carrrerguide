import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    input: {
      targetRole: String,
      skills: [{ name: String, level: String }],
    },
    projects: [
      {
        title: String,
        description: String,
        difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
        steps: [String],
        resources: [{ title: String, url: String }],
      }
    ],
    provider: { type: String, required: true },
    model: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AiProjects || mongoose.model("AiProjects", projectSchema);
