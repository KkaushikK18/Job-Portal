export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'recruiter';
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  university?: string;
  major?: string;
  graduationYear?: number;
  skills: string[];
  resume?: string;
  appliedJobs: string[];
}

export interface Recruiter extends User {
  role: 'recruiter';
  company: string;
  position?: string;
  companySize?: string;
  industry?: string;
  postedJobs: string[];
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  description: string;
  requirements: string[];
  salary?: string;
  remote: boolean;
  postedBy: string;
  postedAt: Date;
  deadline: Date;
  applications: Application[];
  status: 'active' | 'closed' | 'draft';
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  coverLetter: string;
  resume?: string;
  appliedAt: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}