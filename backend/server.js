import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/goals", goalRoutes);
app.use("/api/profiles", profileRoutes);

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
