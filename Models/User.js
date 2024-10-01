import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // phone:{
    //     type:Number,
    //     // required:true
    // },
    // location:{
    //     type:String
    // },
    image:{
        type:String
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }

})
export default mongoose.model("User", User)