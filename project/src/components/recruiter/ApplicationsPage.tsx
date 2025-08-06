import React, { useState } from 'react';
import { useJobs } from '../../contexts/JobContext';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, Check, X, Mail } from 'lucide-react';
import { Application } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const { jobs, applications, updateApplicationStatus } = useJobs();
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const userJobs = jobs.filter(job => job.postedBy === user?.id);
  const relevantApplications = applications.filter(app => 
    userJobs.some(job => job._id === app.jobId)
  );

  const filteredApplications = selectedJob === 'all' 
    ? relevantApplications 
    : relevantApplications.filter(app => app.jobId === selectedJob);

  const handleStatusUpdate = (applicationId: string, status: Application['status']) => {
    updateApplicationStatus(applicationId, status);
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication({...selectedApplication, status});
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-600">Review and manage candidate applications</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Jobs</option>
          {userJobs.map(job => (
            <option key={job._id} value={job._id}>
              {job.title} ({job.applications.length} applications)
            </option>
          ))}
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">Applications will appear here once candidates start applying</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => {
            const job = jobs.find(j => j._id === application.jobId);
            if (!job) return null;

            return (
              <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {application.studentName}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {application.studentEmail}
                    </p>
                    <p className="text-blue-600 font-medium">{job.title}</p>
                    <p className="text-sm text-gray-500">
                      Applied {application.appliedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                  <p className="text-gray-700 text-sm line-clamp-3">{application.coverLetter}</p>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  
                  <div className="flex space-x-2">
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'reviewed')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'accepted')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {application.status === 'reviewed' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'accepted')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedApplication.studentName}
                </h3>
                <p className="text-gray-600 flex items-center mb-2">
                  <Mail className="w-4 h-4 mr-1" />
                  {selectedApplication.studentEmail}
                </p>
                <p className="text-sm text-gray-500">
                  Applied {selectedApplication.appliedAt.toLocaleDateString()}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Cover Letter</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </span>
                
                <div className="flex space-x-3">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'reviewed')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'accepted')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selectedApplication.status === 'reviewed' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'accepted')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};