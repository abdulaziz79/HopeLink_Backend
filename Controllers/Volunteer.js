import Volunteer from "../Models/Volunteer.js";

// Create a volunteer post
export const createVolunteer = async (req, res) => {
  const { description, location, phone } = req.body;
  try {
    const newPost = await Volunteer.create({
      description,
      location,
      phone,
      userId: req.user.userId,
    });
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Get all volunteer posts
export const getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.find().populate("userId");
    return res.status(200).json({ volunteer });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Delete a volunteer post by ID 
export const deleteVolunteer = async (req, res) => {
  const { id } = req.params;
  try {
    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer post not found" });
    }

    await volunteer.deleteOne();
    res.status(200).json({ message: "Volunteer post deleted successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
