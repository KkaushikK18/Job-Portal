import React from 'react';
import { Job } from '../types';
import { MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  onView?: (job: Job) => void;
  showActions?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onView,
  showActions = true
}) => {
  const getTypeColor = (type?: Job['type']) => {
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

  const formatDate = (date?: Date) => {
    if (!date || isNaN(new Date(date).getTime())) return 'Unknown';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title || 'Untitled Job'}</h3>
            <p className="text-lg text-blue-600 font-medium">{job.company || 'Unknown Company'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
            {(job.type || 'unknown').replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location || 'Not specified'}
          </div>
          {job.remote && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Remote
            </div>
          )}
          {job.salary && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {job.applications?.length ?? 0} applications
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">{job.description || 'No description provided.'}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements?.slice(0, 4).map((req, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
            >
              {req}
            </span>
          ))}
          {job.requirements?.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              +{job.requirements.length - 4} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Deadline: {formatDate(job.deadline)}
          </div>

          {showActions && (
            <div className="flex space-x-2">
              <button
                onClick={() => onView?.(job)}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => onApply?.(job)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
