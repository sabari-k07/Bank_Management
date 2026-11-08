import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  X,
  Building2,
  FileCheck2
} from 'lucide-react';

export default function JobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (department) params.append('department', department);
    params.append('status', 'OPEN');

    api.getJobs(params.toString())
      .then(data => setJobs(data.jobs || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    if (!user) {
      navigate('/login?redirect=/jobs');
      return;
    }
    if (user.role !== 'CANDIDATE') {
      setNotification({ type: 'error', message: 'Only registered candidates can submit applications.' });
      return;
    }

    setApplying(true);
    setNotification(null);
    try {
      const res = await api.apply(jobId);
      setNotification({
        type: 'success',
        message: `Success! Application submitted with Registration No. ${res.application.application_no}`
      });
      setSelectedJob(null);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Current Career Opportunities
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl">
          View official notification details, qualification guidelines, exam syllabus, and submit your direct application online.
        </p>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-medium flex-1">{notification.message}</div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title, recruitment code, keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-700"
          >
            <option value="">All Departments</option>
            <option value="Retail & Corporate Banking">Retail & Corporate Banking</option>
            <option value="IT & Information Security">IT & Information Security</option>
            <option value="Branch Operations">Branch Operations</option>
          </select>
          <button
            type="button"
            onClick={fetchJobs}
            className="px-5 py-2.5 text-sm font-semibold bg-sky-700 hover:bg-sky-800 text-white rounded-xl shadow-sm transition-colors"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          Loading vacancies...
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-medium text-slate-600">No recruitment openings matched your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-slate-100 text-slate-700">
                    {job.job_code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {job.vacancies} Vacancies
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {job.department}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50/70 rounded-xl p-3.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pay Scale:</span>
                    <span className="font-semibold text-slate-800">{job.salary_grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age Bracket:</span>
                    <span className="font-semibold text-slate-800">{job.min_age} - {job.max_age} Years</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Deadline:</span>
                    <span>{job.end_date}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="pt-6 flex items-center gap-2">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={applying}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  Apply Online
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {selectedJob.job_code}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedJob.title}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {selectedJob.department}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl text-xs border border-slate-100">
              <div>
                <span className="text-slate-400 block">Total Vacancies</span>
                <span className="font-bold text-slate-900 text-sm">{selectedJob.vacancies}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Age Eligibility</span>
                <span className="font-bold text-slate-900 text-sm">{selectedJob.min_age} - {selectedJob.max_age} Years</span>
              </div>
              <div>
                <span className="text-slate-400 block">Pay Scale</span>
                <span className="font-bold text-slate-900 text-sm">{selectedJob.salary_grade}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Opening Date</span>
                <span className="font-bold text-slate-900 text-sm">{selectedJob.start_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Closing Date</span>
                <span className="font-bold text-rose-600 text-sm">{selectedJob.end_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <span className="font-bold text-emerald-600 text-sm">{selectedJob.status}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Minimum Educational Qualification</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                {selectedJob.min_qualification}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Job Description & Responsibilities</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedJob.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleApply(selectedJob.id)}
                disabled={applying}
                className="px-6 py-2.5 text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white rounded-xl shadow-sm shadow-sky-700/20 disabled:opacity-50"
              >
                {applying ? 'Submitting Application...' : 'Confirm & Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

