import express from 'express';
import {
    createSupply,
    getAllSupplies,
    getOneSupply,
    updateSupply,
    deleteSupply
} from '../Controllers/Supplies.js';
import { upload } from "../Middlewares/multer.js"; // Your multer config
import { verifyToken } from '../Middlewares/authentication.js';
const router = express.Router();

// Routes
router.post("/add",  verifyToken, upload.single("image"), createSupply);
router.get("/", getAllSupplies);
router.get("/:id",  getOneSupply);
router.put("/:id", verifyToken, upload.single("image"), updateSupply);
router.delete("/:id",verifyToken, deleteSupply);

export default router;
