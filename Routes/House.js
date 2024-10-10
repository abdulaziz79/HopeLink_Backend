import express from 'express';
import {
    createPost,
    getPosts,
    deletePostById,
    getPostById
} from '../Controllers/House.js';
import { upload } from '../Middlewares/multer.js';
import  {verifyToken, checkRole } from "../Middlewares/authentication.js"
const router = express.Router();

// Route to create a new post
router.post("/add", verifyToken,upload.array("images",10) ,createPost);

// Route to get all posts
router.get("/", getPosts);

// Route to delete a post by ID
router.delete("/:id", verifyToken, deletePostById);

router.get('/:id', getPostById); // Define the route for fetching a single post by ID

export default router;
