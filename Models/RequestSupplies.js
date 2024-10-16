import mongoose from 'mongoose';

const RequestSuppliesSchema = new mongoose.Schema({
    // title: {
    //     type: String,
    //     required: true,
    // },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image:{
        type:String,
        required:false
    },
    status: {
        type: String,
        enum: ['Pending', 'Fulfilled'], // Keeps track of whether the request is fulfilled or pending
        default: 'Pending',
    },
    requestType: {
        type: String,
        enum: ['Home', 'Volunteer', 'Supplies'], // Specifies the type of request
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('RequestSupplies', RequestSuppliesSchema);
