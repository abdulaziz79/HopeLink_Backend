import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Supplies = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Schema.Types.Mixed, // Can be either String ("free") or Number
        required: true,
        validate: {
            validator: function(value) {
                return value === "free" || (typeof value === 'number' && value > 0);
            },
            message: "Price must either be 'free' or a number greater than 0."
        }
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference the User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Supplies", Supplies);
