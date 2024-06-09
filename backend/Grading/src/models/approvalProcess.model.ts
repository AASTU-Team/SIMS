import mongoose, { Document, Schema } from 'mongoose';

interface ApprovalProcessDocument extends Document {
  grade_id: mongoose.Types.ObjectId;
  status: 'Pending' | 'Approved' | 'Rejected';
  department_approval: {
    status: 'Pending' | 'Approved' | 'Rejected';
    by: mongoose.Types.ObjectId;
    reason?: string;
  };
  dean_approval: {
    status: 'Pending' | 'Approved' | 'Rejected';
    by: mongoose.Types.ObjectId;
    reason?: string;
  };
  requested_by: mongoose.Types.ObjectId;
  requested_at: Date;
  attendance_percentage: number;
}

const approvalProcessSchema = new Schema<ApprovalProcessDocument>({
  grade_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  department_approval: {
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: function (this: any) {
        return this.department_approval.status !== 'Pending';
      },
    },
    reason: {
      type: String,
      required: function (this: any) {
        return this.department_approval.status === 'Rejected';
      },
    },
  },
  dean_approval: {
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: function (this: any) {
        return this.dean_approval.status !== 'Pending';
      },
    },
    reason: {
      type: String,
      required: function (this: any) {
        return this.dean_approval.status === 'Rejected';
      },
    },
  },
  requested_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  requested_at: {
    type: Date,
    default: Date.now,
  },
  attendance_percentage: {
    type: Number,
  },
});

const ApprovalProcess = mongoose.model<ApprovalProcessDocument>('ApprovalProcess', approvalProcessSchema);

export default ApprovalProcess;
