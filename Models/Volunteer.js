import mongoose from "mongoose";

const Schema = mongoose.Schema;

const volunteer = new Schema({
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User", 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
export default mongoose.model("Volunteer", volunteer);
