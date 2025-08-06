// routes/jobRoutes.js
import express from 'express';
import { createJob, getAllJobs, applyToJob } from '../controllers/jobController.js';


const router = express.Router();

// POST /api/jobs
router.post('/', createJob);
// GET  /api/jobs
router.get('/', getAllJobs);   
// POST /api/jobs/:id/apply
router.post('/:id/apply', applyToJob);

export default router;
// Export the router to be used in server.js
// This route handles job creation requests