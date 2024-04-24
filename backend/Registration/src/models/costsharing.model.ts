import mongoose from "mongoose";

let costsharingSchema = new mongoose.Schema({

    Stud_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:false
    },
    non_cafe:{
        type:Boolean,
        required:false
    },
    bank_account:{
        type:String,
        required:false
    },
    amount:{
        type:Number,
        required:false
    }

})

module.exports = mongoose.models.Costsharing || mongoose.model("Costsharing", costsharingSchema);