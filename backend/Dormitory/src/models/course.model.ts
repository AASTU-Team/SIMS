import mongoose from "mongoose";

let courseSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: false
    
    },
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Department"
    },
    instructors:{
        type:Array<mongoose.Schema.Types.ObjectId>,
        required:false,
        ref:"Staff"
        
    },
    credits:{
        type:Number,
        required:false,
        default:0
    },
    prerequisites:{
        type:Array<mongoose.Schema.Types.ObjectId>,
        required:false,
        ref:"Course"
    },
    type:{
        type:String,
        required:false,
      
    },
    code:{
        type:String,
        required:false,
        unique:true
    },
    lec:{
        type:String,
        required:false

    },
    lab:{
        type:String,
        required:false
    },
    description:{
        type:String,
        required:false,
        default:""
    }


 

})

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);