import mongoose from "mongoose";

let studentSchema = new mongoose.Schema({
    id:{
        type:String,
        required:false
    },
    image:
    {
        type:Buffer,
        required:false
    },
    name:{
        type:String,
        required:false
    },
    phone:{
        type:String,
        required:false
    },
    birthday:{
        type:Date,
        required:false
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE'],
        required: false
      },




    email:{
        type:String,
        required:false
    },
    department_id:{
        type:String,
        required:false
    },
    status_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Status"
    },
    year:{
        type:Number,
        required:false
    },
    admission_date:{
        type:Date,
        required:false
    },
    grad_date:{
        type:Date,
        required:false
    },
    contact:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    emergencycontact_name:{
        type:String,
        required:false
    },
    emergencycontact_phone:{
        type:String,
        required:false
    },
    emergencycontact_relation:{
        type:String,
        required:false
    },
   



})

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);