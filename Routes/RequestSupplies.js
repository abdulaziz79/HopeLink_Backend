import express from 'express';
import {
    createRequestSupply,
    getRequestSupply,
    getAllRequestSupplies,
    updateRequestSupply,
    deleteRequestSupply
} from '../Controllers/RequestSupplies.js';
import { verifyToken } from '../Middlewares/authentication.js';
const router = express.Router();

// Create a new supply request
router.post('/add',verifyToken,  createRequestSupply);

// Get a specific request by ID
router.get('/:id' , getRequestSupply);

// Get all requests with pagination
router.get('/',  getAllRequestSupplies);

// Update a request by ID
router.put('/:id', verifyToken,  updateRequestSupply);

// Delete a request by ID
router.delete('/:id', verifyToken,  deleteRequestSupply);

export default router;
