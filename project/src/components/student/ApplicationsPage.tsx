import React from 'react';
import { useJobs } from '../../contexts/JobContext';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, jobs } = useJobs();
  const { user } = useAuth();

  const userApplications = applications.filter(app => app.studentId === user?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {userApplications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">Start applying to jobs to see your applications here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userApplications.map((application) => {
            const job = jobs.find(j => j._id === application.jobId);
            if (!job) return null;

            return (
              <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-lg text-blue-600 font-medium">{job.company}</p>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(application.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Applied on {application.appliedAt.toLocaleDateString()}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                  <p className="text-gray-700 text-sm">{application.coverLetter}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};