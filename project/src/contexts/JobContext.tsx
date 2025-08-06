import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { Job, Application } from '../types';

interface JobContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'postedAt' | 'applications'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  applyToJob: (jobId: string, application: Omit<Application, 'id' | 'appliedAt'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  searchJobs: (query: string, filters: any) => Job[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

// Mock data
const mockJobs: Job[] = [
  {
    _id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'internship',
    description: 'Join our team as a Frontend Developer Intern and work on cutting-edge web applications using React, TypeScript, and modern web technologies.',
    requirements: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    salary: '$20-25/hour',
    remote: true,
    postedBy: 'recruiter-1',
    postedAt: new Date('2024-01-15'),
    deadline: new Date('2024-02-15'),
    applications: [],
    status: 'active'
  },
  {
    _id: '2',
    title: 'Software Engineer',
    company: 'InnovateLabs',
    location: 'New York, NY',
    type: 'full-time',
    description: 'We are looking for a passionate Software Engineer to join our growing team. You will work on backend systems using Node.js and Python.',
    requirements: ['Node.js', 'Python', 'SQL', 'AWS', 'Docker'],
    salary: '$80,000 - $120,000',
    remote: false,
    postedBy: 'recruiter-2',
    postedAt: new Date('2024-01-10'),
    deadline: new Date('2024-02-10'),
    applications: [],
    status: 'active'
  },
  {
    _id: '3',
    title: 'Data Science Intern',
    company: 'DataFlow Analytics',
    location: 'Austin, TX',
    type: 'internship',
    description: 'Exciting opportunity to work with big data and machine learning algorithms. Perfect for students studying data science or related fields.',
    requirements: ['Python', 'Pandas', 'SQL', 'Machine Learning', 'Statistics'],
    salary: '$18-22/hour',
    remote: true,
    postedBy: 'recruiter-3',
    postedAt: new Date('2024-01-12'),
    deadline: new Date('2024-02-12'),
    applications: [],
    status: 'active'
  }
];

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>([]);

  const addJob = (jobData: Omit<Job, 'id' | 'postedAt' | 'applications'>) => {
    const newJob: Job = {
      ...jobData,
      _id: `job-${Date.now()}`,
      postedAt: new Date(),
      applications: []
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => job._id === id ? { ...job, ...updates } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job._id !== id));
  };

  const applyToJob = async (jobId: string, applicationData: Omit<Application, 'id' | 'appliedAt'>) => {
    // Send application to backend
    await axios.post(`/jobs/${jobId}/apply`, applicationData);

    // Fetch updated jobs from backend
    const res = await axios.get('/jobs');
    setJobs(res.data);

    // Optionally, update applications state for "My Applications" page
    const allApplications: Application[] = [];
    res.data.forEach((job: any) => {
      if (Array.isArray(job.applications)) {
        job.applications.forEach((app: any) => {
          allApplications.push({
            ...app,
            jobId: job._id,
            id: app._id || `${job._id}-${app.studentId}-${app.appliedAt}`,
          });
        });
      }
    });
    setApplications(allApplications);
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status } : app
    ));
    
    setJobs(prev => prev.map(job => ({
      ...job,
      applications: job.applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    })));
  };

  const searchJobs = (query: string, filters: any): Job[] => {
    return jobs.filter(job => {
      const matchesQuery = query === '' || 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase());
      
      const matchesType = !filters.type || job.type === filters.type;
      const matchesRemote = filters.remote === undefined || job.remote === filters.remote;
      const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesQuery && matchesType && matchesRemote && matchesLocation;
    });
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      addJob,
      updateJob,
      deleteJob,
      applyToJob,
      updateApplicationStatus,
      searchJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};