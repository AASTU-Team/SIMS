import mongoose from "mongoose";

let staffSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Department"
    },
    phone:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    birthday:{
        type:Date,
        required:false
    },
    gender:{
        type: String,
        enum: ['MALE', 'FEMALE'],
        required: false
    }


})

module.exports = mongoose.models.Staff || mongoose.model("Staff", staffSchema);