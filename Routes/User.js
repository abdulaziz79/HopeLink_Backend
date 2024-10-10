// import express from "express"
// import User from "../Models/User.js"
// import { register, getUserById, getUsers, deleteUserById  } from "../Controllers/User.js"

// const user = express.Router();
// user.post("/register", register)
// user.get("/read/all",getUsers)
// user.get("/getUserById/:id", getUserById);
// user.delete("/delete/:id", deleteUserById)

// export default user



import express from "express";
import { 
    register, 
    getUsers, 
    getUserById, 
    deleteUserById 
} from "../Controllers/User.js"; // Import user controller functions
import { login, verifyToken, loggedInUser, logOut , checkRole} from "../Middlewares/authentication.js"; // Import authentication middleware

const router = express.Router();

// Route for user registration
router.post("/register", register); // Create a new user

// Route for user login
router.post("/login", login); // Log in a user

// Route to get the logged-in user information (protected)
router.get("/me", verifyToken, loggedInUser); // Get logged-in user data

// Route to get all users (protected, for admin use case)
router.get("/", verifyToken, getUsers); // Get all users

// Route to get a specific user by ID (protected)
router.get("/:id", verifyToken, getUserById); // Get user by ID

// Route to delete a user by ID (protected)
router.delete("/:id", verifyToken, checkRole(['admin']), deleteUserById); // Delete user by ID

// Route for logging out
router.post("/logout", logOut); // Log out user

export default router;
