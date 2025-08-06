import React, { useState } from 'react';
import { Job } from '../../types';
import { useJobs } from '../../contexts/JobContext';
import { useAuth } from '../../contexts/AuthContext';
import { X, MapPin, Clock, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';

interface JobModalProps {
  job?: Job; // Made optional to allow undefined safety
  isOpen: boolean;
  onClose: () => void;
}

export const JobModal: React.FC<JobModalProps> = ({ job, isOpen, onClose }) => {
  const { applyToJob } = useJobs();
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (!isOpen || !job) return null;

  const handleApply = async () => {
    if (!user || !job) return;

    setIsApplying(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    applyToJob(job._id, {
      jobId: job._id,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      coverLetter,
      status: 'pending'
    });

    setIsApplying(false);
    onClose();
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-100 text-green-800';
      case 'part-time':
        return 'bg-blue-100 text-blue-800';
      case 'internship':
        return 'bg-purple-100 text-purple-800';
      case 'contract':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!showApplicationForm ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job?.title}</h1>
                    <p className="text-xl text-blue-600 font-medium">{job?.company}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(job?.type)}`}>
                    {(job?.type || 'unknown').replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {job?.location || 'Unknown'}
                  </div>
                  {job?.remote && (
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Remote Work Available
                    </div>
                  )}
                  {job?.salary && (
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      {job.salary}
                    </div>
                  )}
                  {job?.deadline && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{job?.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {job?.requirements?.map((req, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <Briefcase className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-blue-800 font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply for This Job
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Apply for {job?.title}</h3>
                <p className="text-gray-600">Tell us why you're perfect for this role</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={8}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write a compelling cover letter..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    disabled={isApplying}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={isApplying || !coverLetter.trim()}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isApplying && <LoadingSpinner size="sm" className="mr-2" />}
                    {isApplying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};