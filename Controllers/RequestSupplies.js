import RequestSupplies from '../Models/RequestSupplies.js';


// Create a new request supply
export const createRequestSupply = async (req, res) => {
    const { description, location, phone, requestType } = req.body;
    console.log(description, location,phone,requestType)
    try {
        // Ensure user is logged in
        if (!req.user) {
            return res.status(401).json("You need to be logged in to create a request");
        }

        // Validate required fields
        if (!description || !location || !phone || !requestType) {
            return res.status(400).json("All fields are required");
        }

    
        let image = null;
        if (req.file) {
            image = req.file.filename; 
        }

        // Create a new request supply item
        const newRequestSupply = await RequestSupplies.create({
            description,
            location,
            phone,
            image,  
            requestedBy: req.user.userId,
            requestType,
            status: 'Pending' 
        });

        return res.status(201).json(newRequestSupply); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Problem adding request supply", error: err.message });
    }
};

export const getHomeRequests = async (req, res) => {
    try {
        const homeRequests = await RequestSupplies.find({ requestType: 'Home' }).populate("requestedBy").sort({createdAt:-1})


        if (homeRequests.length === 0) {
            return res.status(404).json({ message: "No Home requests found" });
        }
        return res.status(200).json(homeRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving Home requests", error: err.message });
    }
};
export const getSuppliesRequests = async (req, res) => {
    try {
        const homeRequests = await RequestSupplies.find({ requestType: 'Supplies' }).populate("requestedBy").sort({createdAt:-1})


        if (homeRequests.length === 0) {
            return res.json({ message: "No Home requests found" });
        }

        return res.status(200).json(homeRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving Home requests", error: err.message });
    }
};
export const getVolunteerRequests = async (req, res) => {
    try {
        const homeRequests = await RequestSupplies.find({ requestType: 'Volunteer' }).populate('requestedBy').sort({createdAt:-1})


        if (homeRequests.length === 0) {
            return res.status(404).json({ message: "No Home requests found" });
        }

        // Return the list of requests
        return res.status(200).json(homeRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving Home requests", error: err.message });
    }
};


// Get a single supply request by ID
export const getRequestSupply = async (req, res) => {
    const { id } = req.params;

    try {
        const requestSupply = await RequestSupplies.findById(id).populate('requestedBy');

        if (!requestSupply) {
            return res.status(404).json({ error:error.message });
        }

        return res.status(200).json(requestSupply);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Problem fetching request", error: err.message });
    }
};

// Get all supply requests with pagination
export const getAllRequestSupplies = async (req, res) => {
    const { page = 1, limit = 8 } = req.query; // Default page = 1, limit = 8 items per page

    try {
        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Fetch the supply requests with pagination
        const requestSupplies = await RequestSupplies.find()
            .populate('requestedBy') // Assuming requestedBy is a reference field
            .skip((pageNumber - 1) * limitNumber) // Skip items from previous pages
            .limit(limitNumber); // Limit the number of items per page

        // Get the total number of supply requests
        const totalItems = await RequestSupplies.countDocuments();

        return res.status(200).json({
            requestSupplies,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalItems / limitNumber), // Calculate total pages
            totalItems
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Problem fetching requests", error: err.message });
    }
};


// Update a supply request
export const updateRequestSupply = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, phone, status ,requestType} = req.body;

    try {
        if (!req.user) {
            return res.status(401).json("You need to be logged in to update this request");
        }

        const requestSupply = await RequestSupplies.findById(id);

        if (!requestSupply) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Update the fields if they are provided
        if (title) requestSupply.title = title;
        if (description) requestSupply.description = description;
        if (location) requestSupply.location = location;
        if (phone) requestSupply.phone = phone;
        if (status) requestSupply.status = status; // This can be 'Pending' or 'Fulfilled'
        if (requestType) requestSupply.requestType = requestType;  // Allow request type update

        await requestSupply.save();

        return res.status(200).json(requestSupply);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Problem updating request", error: err.message });
    }
};



// Delete a supply request
export const deleteRequestSupply = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure the user is logged in
        if (!req.user) {
            return res.status(401).json("You need to be logged in to delete a request");
        }

        const requestSupply = await RequestSupplies.findById(id);

        if (!requestSupply) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Remove the request supply
        await requestSupply.deleteOne();

        return res.status(200).json({ message: "Request successfully deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Problem deleting request", error: err.message });
    }
};

