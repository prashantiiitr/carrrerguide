import mongoose from "mongoose";

const mockSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    input: {
      targetRole: String,
      seniority: { type: String, enum: ["Junior", "Mid", "Senior"], default: "Junior" }
    },
    mock: {
      technical: [{ question: String, answer: String }],
      behavioral: [{ question: String, answer: String }]
    },
    provider: { type: String, required: true },
    model: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AiMock || mongoose.model("AiMock", mockSchema);
