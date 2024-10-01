import fs from 'fs';
import Supplies from "../models/Supplies.js"; // Adjust the path according to your file structure
import { title } from 'process';

// Create Supply
import fs from 'fs';
import Supplies from "../models/Supplies.js"; // Adjust the path according to your file structure

// Create Supply
export const createSupply = async (req, res) => {
    const {
        title,
        description,
        location,
        phone,
        price,
    } = req.body;

    try {
        // Ensure user is logged in
        if (!req.user) {
            return res.status(401).json("You need to be logged in to create a supply");
        }

        // Validate required fields
        if (!title || !description || !location || !phone || !price) {
            if (req.file) {
                const path = `Public/images/${req.file.filename}`;
                fs.unlinkSync(path); // Remove the uploaded file if validation fails
            }
            return res.status(400).json("All fields are required");
        }

        // Check if an image was uploaded
        if (!req.file) {
            return res.status(400).json("Upload an image");
        }

        // Get the filename from the uploaded file
        const image = req.file.filename;

        // Create a new supply item in the database
        const newSupply = await Supplies.create({
            title,
            description,
            image,
            location,
            phone,
            price,
            postedBy: req.user.name, // Store the user's name as postedBy
        });

        return res.status(200).json(newSupply); // Return the newly created supply
    } catch (err) {
        console.log(err);
        if (req.file) {
            const path = `Public/images/${req.file.filename}`;
            fs.unlinkSync(path); // Remove the uploaded file in case of error
        }
        res.status(500).json({ message: "Problem adding supply", error: err });
    }
};



// Get All Supplies
export const getAllSupplies = async (req, res) => {
    try {
        const supplies = await Supplies.find();
        res.status(200).json(supplies);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get One Supply
export const getOneSupply = async (req, res) => {
    const supplyId = req.params.id;

    try {
        const supply = await Supplies.findById(supplyId);

        if (!supply) {
            return res.status(404).json({ error: "Supply not found" });
        }

        res.status(200).json(supply);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update Supply
export const updateSupply = async (req, res) => {
    const supplyId = req.params.id;
    const { description, location, phone, price, title } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json("You need to be logged in to update this supply");
        }

        const existingSupply = await Supplies.findById(supplyId);

        if (!existingSupply) {
            if (req.file) {
                const path = `Public/images/${req.file.filename}`;
                fs.unlinkSync(path);
            }
            return res.status(404).json({ error: "Supply not found" });
        }

        // Update the fields if they are provided
        if (title) existingSupply.title = title;
        if (description) existingSupply.description = description;
        if (location) existingSupply.location = location;
        if (phone) existingSupply.phone = phone;
        if (price) existingSupply.price = price;

        const oldImagePath = `Public/images/${existingSupply.image}`;

        if (req.file) {
            existingSupply.image = req.file.filename;

            try {
                fs.unlinkSync(oldImagePath);
            } catch (err) {
                console.error("Error deleting old image:", err);
                return res.status(500).json({ error: "Error deleting the old image" });
            }
        }

        await existingSupply.save();

        return res.status(200).json(existingSupply);
    } catch (error) {
        console.error("Error:", error);
        if (req.file) {
            const imagePath = `Public/images/${req.file.filename}`;
            fs.unlinkSync(imagePath);
        }
        res.status(500).json({ message: "Problem editing supply", error });
    }
};



// Delete Supply
export const deleteSupply = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure the user is logged in
        if (!req.user) {
            return res.status(401).json("You need to be logged in to delete a supply");
        }

        const supply = await Supplies.findById(id);

        if (!supply) {
            return res.status(404).json({ message: "Supply not found" });
        }

        // Delete the image from the file system
        const imagePath = `Public/images/${supply.image}`;
        try {
            fs.unlinkSync(imagePath); // Remove the image file
        } catch (err) {
            console.error("Error deleting image:", err);
        }

        // Remove the supply
        await supply.remove();

        return res.status(200).json({ message: "Supply successfully deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Problem deleting supply", error: err.message });
    }
};


