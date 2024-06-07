import mongoose, { Schema, Document } from 'mongoose';

interface AssessmentDocument extends Document {
  name: string;
  value: number;
}

const assessmentSchema = new Schema<AssessmentDocument>({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const Assessment = mongoose.model<AssessmentDocument>('Assessment', assessmentSchema);
export default Assessment;
