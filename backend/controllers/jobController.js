// controllers/jobController.js
import Job from '../models/Job.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const { title, company, location, description, salary } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const newJob = new Job({
      title,
      company,
      location,
      description,
      salary,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Public
export const applyToJob = async (req, res) => {
  try {
    const { id } = req.params;
    const application = {
      studentId: req.body.studentId,
      studentName: req.body.studentName,
      studentEmail: req.body.studentEmail,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume || '',
      appliedAt: new Date(),
      status: 'pending'
    };
    const job = await Job.findByIdAndUpdate(
      id,
      { $push: { applications: application } },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Applied successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


