import express from 'express';
import {
    createRequestSupply,
    getRequestSupply,
    getAllRequestSupplies,
    updateRequestSupply,
    deleteRequestSupply
} from '../Controllers/RequestSupplies.js';

const router = express.Router();

// Create a new supply request
router.post('/request-supplies', createRequestSupply);

// Get a specific request by ID
router.get('/request-supplies/:id', getRequestSupply);

// Get all requests with pagination
router.get('/request-supplies', getAllRequestSupplies);

// Update a request by ID
router.put('/request-supplies/:id', updateRequestSupply);

// Delete a request by ID
router.delete('/request-supplies/:id', deleteRequestSupply);

export default router;
