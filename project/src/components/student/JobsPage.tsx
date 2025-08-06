import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { JobCard } from '../JobCard';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';
import { Job } from '../../types';
import { JobModal } from './JobModal';


export const JobsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    remote: undefined as boolean | undefined,
    location: ''
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(false);
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

  // Optional: apply client-side filtering based on searchQuery and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filters.type ? job.type === filters.type : true;
    const matchesRemote = filters.remote === undefined ? true : job.remote === filters.remote;
    const matchesLocation = filters.location
      ? job.location?.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    return matchesSearch && matchesType && matchesRemote && matchesLocation;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
        <p className="text-gray-600">Discover opportunities that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Style</label>
              <select
                value={filters.remote === undefined ? '' : filters.remote.toString()}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  remote: e.target.value === '' ? undefined : e.target.value === 'true' 
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Remote</option>
                <option value="false">On-site</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onApply={() => setSelectedJob(job)}
            onView={() => setSelectedJob(job)}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Job Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          isOpen={true}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};
