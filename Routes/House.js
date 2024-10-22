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

router.post("/add", verifyToken,upload.array("images",6) ,createPost);

router.get("/", getPosts);

router.delete("/delete/:id", verifyToken, deletePostById);

router.get('/:id', getPostById); 

export default router;
