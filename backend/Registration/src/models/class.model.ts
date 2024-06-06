import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    id: Number,
    dept: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    meetingTime: { type: mongoose.Schema.Types.ObjectId, ref: 'MeetingTime' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  });

  module.exports = mongoose.models.Class || mongoose.model("Class", classSchema);

