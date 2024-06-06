import mongoose from "mongoose";

let annualPlanSchema = new mongoose.Schema({
  academic_year: {
    type: String,
    required: true,
  },
  events: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: true,
    ref: "Event",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports =
  mongoose.models.AnnualPlan || mongoose.model("AnnualPlan", annualPlanSchema);
