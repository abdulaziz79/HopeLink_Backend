import fs from "fs";
import Supplies from "../Models/Supplies.js"; // Adjust the path according to your file structure
import { title } from "process";

// Create Supply
export const createSupply = async (req, res) => {
  const { description, location, phone, price } = req.body;

  try {

    if (!description || !location || !phone || !price) {
      if (req.file) {
        const path = `Public/images/${req.file.filename}`;
        fs.unlinkSync(path); // Remove the uploaded file if validation fails
      }
      return res.status(400).json("All fields are required");
    }

    // Optional image: only set if a file is uploaded
    let image;
    if (req.file) {
      image = req.file.filename;
    }

    let finalPrice;
    if (price === "free") {
      finalPrice = price;
    } else {
      finalPrice = Number(price);
      if (isNaN(finalPrice) || finalPrice <= 0) {
        return res.status(400).json("Price must either be 'free' or a number greater than 0.");
      }
    }

    // Create the new supply item in the database
    const newSupplyData = {
      description,
      location,
      phone,
      price: finalPrice, // Store the finalPrice after conversion
      userId: req.user.userId, // Store the user's ID in the User field
    };

    if (image) {
      newSupplyData.image = image;
    }

    const newSupply = await Supplies.create(newSupplyData);

    return res.status(200).json(newSupply); 
  } catch (err) {
    console.log(err);
    if (req.file) {
      const path = `Public/images/${req.file.filename}`;
      fs.unlinkSync(path); // Remove the uploaded file in case of error
    }
    res.status(500).json({ message: "Problem adding supply", error: err.message });
  }
};


// Get all supplies with pagination
export const getAllSupplies = async (req, res) => {
  try {

      const supplies = await Supplies.find().populate("userId").sort({createdAt:-1})

      return res.status(200).json({
          supplies

      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Problem fetching supplies", error: err.message });
  }
};

// Get One Supply
export const getOneSupply = async (req, res) => {
  const supplyId = req.params.id;

  try {
    const supply = await Supplies.findById(supplyId).populate("User");

    if (!supply) {
      return res.status(404).json({ error: "Supply not found" });
    }

    res.status(200).json(supply);
  } catch (error) {
    res.status(500).json({ error: Error });
  }
};

// Update Supply
export const updateSupply = async (req, res) => {
  const supplyId = req.params.id;
  const { description, location, phone, price, title } = req.body;

  try {
    if (!req.user) {
      return res
        .status(401)
        .json("You need to be logged in to update this supply");
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
    // Handle and validate price update
    
        let finalPrice;
        if (price === "free") {
          finalPrice = price;
        } else {
          finalPrice = Number(price);
          if (isNaN(finalPrice) || finalPrice <= 0) {
            return res
              .status(400)
              .json("Price must either be 'free' or a number greater than 0.");
          }
        }
      existingSupply.price = finalPrice;
    
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
    if (!req.user) {
      return res
        .status(401)
        .json("You need to be logged in to delete a supply");
    }

    const supply = await Supplies.findById(id);

    if (!supply) {
      return res.status(404).json({ message: "Supply not found" });
    }

    const imagePath = `Public/images/${supply.image}`;
    try {
      fs.unlinkSync(imagePath); 
    } catch (err) {
      console.error("Error deleting image:", err);
    }

    // Remove the supply
    await supply.deleteOne();

    return res.status(200).json({ message: "Supply successfully deleted" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Problem deleting supply", error: err.message });
  }
};
