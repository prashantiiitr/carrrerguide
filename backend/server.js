import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();




const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRoutes);


app.use("/api/profiles", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Career Mentor Backend Running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
