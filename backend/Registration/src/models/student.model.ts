import mongoose from "mongoose";

let studentSchema = new mongoose.Schema({
    Stud_Id:{
        type:String,
        required:false
    },
    Stud_Image:
    {
        type:String,
        required:false
    },
    Stud_Name:{
        type:String,
        required:false
    },
    Stud_Phone:{
        type:String,
        required:false
    },
    Stud_birthday:{
        type:Date,
        required:false
    },
    Stud_Gender: {
        type: String,
        enum: ['MALE', 'FEMALE'],
        required: false
      },




    Stud_Email:{
        type:String,
        required:false
    },
    department_id:{
        type:String,
        required:false
    },
    Status_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Status"
    },
    Stud_year:{
        type:Number,
        required:false
    },
    Stud_year_admission:{
        type:Date,
        required:false
    },
    Sgrad_date:{
        type:Date,
        required:false
    },
    Stud_Contact:{
        type:String,
        required:false
    },
    Stud_address:{
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