import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String },
    applications: [
      {
        studentId: String,
        studentName: String,
        studentEmail: String,
        coverLetter: String,
        resume: String,
        appliedAt: Date,
        status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' }
      }
    ]
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
