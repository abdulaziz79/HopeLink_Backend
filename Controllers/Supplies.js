import fs from 'fs';
import Supplies from "../models/Supplies.js"; // Adjust the path according to your file structure
import { title } from 'process';

// Create Supply
export const createSupply = async (req, res) => {
    const {
        title,
        description,
        location,
        phone,
        price,
        postedBy, // it's the user id
    } = req.body;

    try {
        // Validate required fields
        if (!title ||!description || !location || !phone || !price || !postedBy) {
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
            User: postedBy, // Ensure to match the field in your schema
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
    const { description, location, phone, price } = req.body;

    try {
        const existingSupply = await Supplies.findById(supplyId);

        if (!existingSupply) {
            if (req.file) {
                const path = `Public/images/${req.file.filename}`;
                fs.unlinkSync(path);
            }
            return res.status(404).json({ error: "Supply not found" });
        }
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
    const supplyId = req.params.id;

    try {
        const supply = await Supplies.findById(supplyId);

        if (!supply) {
            return res.status(404).json({ error: "Supply not found" });
        }

        const imagePath = `Public/images/${supply.image}`;
        fs.unlinkSync(imagePath, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error deleting supply image" });
            }
        });

        await Supplies.deleteOne({ _id: supplyId });

        return res.status(200).json({ message: "Supply deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
