import Profile from "../models/Profile.js";

// Create profile
export const createProfile = async (req, res) => {
  try {
    const profile = await Profile.create({ ...req.body, user: req.user._id });
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get logged-in user's profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Profile removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
