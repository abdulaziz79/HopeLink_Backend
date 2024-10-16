import express from 'express';
import {
    createRequestSupply,
    getRequestSupply,
    getAllRequestSupplies,
    updateRequestSupply,
    deleteRequestSupply,
    getHomeRequests,
    getSuppliesRequests,
    getVolunteerRequests
} from '../Controllers/RequestSupplies.js';
import { verifyToken } from '../Middlewares/authentication.js';
import { upload } from '../Middlewares/multer.js';
const router = express.Router();

// Create a new supply request
router.post('/add',verifyToken,upload.single("images") , createRequestSupply);

// Get a specific request by ID
router.get('/:id' , getRequestSupply);

// Get all requests with pagination
router.get('/',  getAllRequestSupplies);
router.get('/home/requests',  getHomeRequests);
router.get('/supplies/requests',  getSuppliesRequests);

router.get('/volunteer/requests',  getVolunteerRequests);



// Update a request by ID
router.put('/:id', verifyToken,  updateRequestSupply);

// Delete a request by ID
router.delete('/:id', verifyToken,  deleteRequestSupply);

export default router;
