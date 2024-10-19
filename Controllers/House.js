import House from "../Models/House.js";
import fs from "fs";
import path from "path";
import { error } from "console";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create a new post with multiple images
export const createPost = async (req, res) => {
 // Log the uploaded files
    console.log(req.user.userId)
    try {
        const { location, houseSpace, bedrooms, phone, price } = req.body;
        const imageFiles = req.files; // Assuming you're using multer for handling image uploads

        // Ensure the user is logged in
        if (!req.user || !req.user.userId) {
            return res.status(401).json("You need to be logged in to create a post.");
        }


        if (!location  || !phone) {
            return res.status(400).json({message:error.message});
        }


        const imagePaths = imageFiles ? imageFiles.map(file => file.filename) : [];


        // Create the new house post
        const newPost = new House({
            location,
            houseSpace,
            price,
            bedrooms,
            phone,
            userId: req.user.userId, // Link the post to the logged-in user
            images: imagePaths // Store the uploaded image paths
        });

        // Save the post
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get all posts with pagination and user information
// export const getPosts = async (req, res) => {
//     const { page = 1, limit = 8 } = req.query; // Default pagination
//     try {
//         // Convert page and limit to integers
//         const pageNumber = parseInt(page);
//         const limitNumber = parseInt(limit);

//         // Fetch posts with pagination and populate user information
//         const posts = await House.find()
//             .populate("userId") // Populate only relevant fields
//             .skip((pageNumber - 1) * limitNumber) // Skip items based on pagination
//             .limit(limitNumber);

//         // Count the total number of house posts
//         const totalItems = await House.countDocuments();

//         return res.status(200).json({
//             posts,
//             currentPage: pageNumber,
//             totalPages: Math.ceil(totalItems / limitNumber),
//             totalItems
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//     }
// };
export const getPosts = async (req, res) => {
    try {
        // Fetch all posts and populate user information
        const posts = await House.find().sort({createdAt:-1})
            .populate("userId"); // Populate only relevant fields

        // Count the total number of house posts
        const totalItems = await House.countDocuments();

        return res.status(200).json({
            posts,
            totalItems
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Delete a post by its ID and unlink images
export const deletePostById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the post by ID
        const post = await House.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Ensure the user is authorized to delete the post (user must be the owner)
        if (!req.user) {
            return res.status(401).json("You need to be logged in to delete a supply");
        }

        // Unlink (delete) the associated images from the file system
        if (post.images && post.images.length > 0) {
            post.images.forEach((imagePath) => {
                fs.unlink(path.join(__dirname, "..", imagePath), (err) => {
                    if (err) {
                        console.error("Error deleting image:", err);
                    }
                });
            });
        }

        // Delete the post from the database
        await post.deleteOne();

        return res.status(200).json({ message: "Post deleted successfully", post });

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};




// Get a single house post by its ID
export const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the house post by ID and populate user information
        const post = await House.findById(id).populate("userId", "name email");

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        return res.status(200).json(post);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
