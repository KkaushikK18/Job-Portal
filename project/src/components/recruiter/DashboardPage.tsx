import React from 'react';
import { useJobs } from '../../contexts/JobContext';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { jobs, applications } = useJobs();
  const { user } = useAuth();

  const userJobs = jobs.filter(job => job.postedBy === user?.id);
  const totalApplications = userJobs.reduce((sum, job) => sum + job.applications.length, 0);
  const activeJobs = userJobs.filter(job => job.status === 'active').length;
  const pendingApplications = applications.filter(app => 
    userJobs.some(job => job.id === app.jobId) && app.status === 'pending'
  ).length;

  const recentApplications = applications
    .filter(app => userJobs.some(job => job.id === app.jobId))
    .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your job postings and applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {userJobs.length > 0 ? Math.round(totalApplications / userJobs.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
        
        {recentApplications.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((application) => {
              const job = jobs.find(j => j.id === application.jobId);
              if (!job) return null;

              return (
                <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{application.studentName}</h3>
                    <p className="text-sm text-gray-600">{job.title}</p>
                    <p className="text-xs text-gray-500">Applied {application.appliedAt.toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};