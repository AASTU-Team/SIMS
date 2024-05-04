import mongoose from "mongoose";

let studentSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    image:
    {
        type:Buffer,
        required:false
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    birthday:{
        type:Date,
        required:true
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE'],
        required: true
      },




    email:{
        type:String,
        required:true
    },
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Department"
    },
    status_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Status"
    },
    year:{
        type:Number,
        required:true
    },
    admission_date:{
        type:Date,
        required:true
    },
    grad_date:{
        type:Date,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    emergencycontact_name:{
        type:String,
        required:true
    },
    emergencycontact_phone:{
        type:String,
        required:true
    },
    emergencycontact_relation:{
        type:String,
        required:true
    },
   



})

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);