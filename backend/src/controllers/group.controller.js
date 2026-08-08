import Group from "../models/Groups.js";

// Create group
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const group = await Group.create({
      name,
      members: [...members, req.user._id], // add creator
      admin: req.user._id,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's groups
export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    }).populate("members", "fullName profilePic");

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};