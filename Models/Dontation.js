import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Donation = new Schema({
    Description:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    location:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
})

export default mongoose.model("Donation", Donation)