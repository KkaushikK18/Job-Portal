import { useEffect, useState } from 'react';
import axios from '../api/axios' // assuming you create axios.js in src/api
import { Job } from '../types';

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/jobs');
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Available Jobs</h2>
      {jobs.map((job) => (
        <div key={job._id} className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company} – {job.location}</p>
          <p className="mt-2">{job.description}</p>
          {job.salary && <p className="mt-1 text-green-600">💰 {job.salary}</p>}
        </div>
      ))}
    </div>
  );
};

export default JobList;
