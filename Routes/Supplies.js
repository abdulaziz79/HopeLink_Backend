import express from 'express';
import {
    createSupply,
    getAllSupplies,
    getOneSupply,
    updateSupply,
    deleteSupply
} from '../Controllers/Supplies.js';
import { upload } from "../Middlewares/multer.js"; // Your multer config

const router = express.Router();

// Routes
router.post("/supplies", upload.single("image"), createSupply);
router.get("/supplies", getAllSupplies);
router.get("/supplies/:id", getOneSupply);
router.put("/supplies/:id", upload.single("image"), updateSupply);
router.delete("/supplies/:id", deleteSupply);

export default router;
