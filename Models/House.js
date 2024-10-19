import mongoose from "mongoose";

const Schema = mongoose.Schema;

const House = new Schema({
    location: {
        type: String,
        required: true
    },
    // governorate: {
    //     type: String,
    //     required: true
    // },
    houseSpace: {
        type: Number,
    },
    bedrooms: {
        type: Number,
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: {
        type: [String], 
        required: false
    }
}, { timestamps: true }); 

export default mongoose.model("House", House);
