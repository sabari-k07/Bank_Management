import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X,
  Award,
  CreditCard,
  Send
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  
  // Modals state
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Admit Card modal
  const [admitModalApp, setAdmitModalApp] = useState(null);
  const [admitData, setAdmitData] = useState({
    examCenter: 'Apex Digital Assessment Zone, Hall B',
    reportingTime: '08:30 AM',
    instructions: '1. Bring original government photo ID.\n2. Strict gate closure at 09:15 AM.'
  });

  // Result publishing modal
  const [resultModalApp, setResultModalApp] = useState(null);
  const [resultData, setResultData] = useState({
    marksObtained: '',
    rank: '',
    isQualified: true,
    remarks: 'Qualified for Personal Interview'
  });

  const loadData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (search) params.append('search', search);

    Promise.all([
      api.getAnalytics(),
      api.getAllApplications(params.toString())
    ])
      .then(([analyticsData, appData]) => {
        setAnalytics(analyticsData);
        setApplications(appData.applications || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp || !newStatus) return;
    setActionLoading(true);
    try {
      await api.updateApplicationStatus(selectedApp.id, newStatus, reviewNotes);
      setSelectedApp(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssueAdmitCard = async (e) => {
    e.preventDefault();
    if (!admitModalApp) return;
    setActionLoading(true);
    try {
      await api.issueAdmitCard({
        applicationId: admitModalApp.id,
        examId: 1, // Default primary exam
        examCenter: admitData.examCenter,
        reportingTime: admitData.reportingTime,
        instructions: admitData.instructions
      });
      alert('Admit card successfully issued!');
      setAdmitModalApp(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to issue admit card.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishResult = async (e) => {
    e.preventDefault();
    if (!resultModalApp) return;
    setActionLoading(true);
    try {
      await api.publishResult({
        applicationId: resultModalApp.id,
        examId: 1,
        marksObtained: parseFloat(resultData.marksObtained),
        rank: resultData.rank ? parseInt(resultData.rank) : null,
        isQualified: resultData.isQualified,
        remarks: resultData.remarks
      });
      alert('Examination result successfully recorded!');
      setResultModalApp(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to record result.');
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    if (applications.length === 0) return;
    const headers = ['Application No', 'Candidate Name', 'Email', 'Phone', 'Job Code', 'Job Title', 'Status', 'Applied At'];
    const rows = applications.map(a => [
      a.application_no,
      `"${a.candidate_name}"`,
      a.candidate_email,
      a.candidate_phone,
      a.job_code,
      `"${a.job_title}"`,
      a.status,
      a.applied_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bank_recruitment_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruitment Administration Console</h1>
          <p className="text-xs sm:text-sm text-slate-500">Manage vacancies, review applicant submissions, issue admit cards, and publish scores.</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV Roster
        </button>
      </div>

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block">Total Active Vacancies</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{analytics.summary.activeJobs}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Active Posts</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block">Registered Candidates</span>
            <div className="text-2xl font-black text-sky-800 mt-1">{analytics.summary.totalCandidates}</div>
            <span className="text-[11px] text-sky-600 font-semibold">Verified Profiles</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block">Total Applications</span>
            <div className="text-2xl font-black text-indigo-800 mt-1">{analytics.summary.totalApplications}</div>
            <span className="text-[11px] text-indigo-600 font-semibold">Across all cadres</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block">Admit Cards & Shortlists</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {(analytics.statusBreakdown.find(s => s.status === 'Admit Card Issued')?.count || 0) +
               (analytics.statusBreakdown.find(s => s.status === 'Shortlisted')?.count || 0)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Ready for Assessment</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            placeholder="Search candidate name, application no, or email..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Admit Card Issued">Admit Card Issued</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={loadData}
            className="px-4 py-2 text-sm font-semibold bg-sky-700 text-white rounded-xl hover:bg-sky-800 transition-colors cursor-pointer"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Applications Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">App No.</th>
                <th className="p-4">Candidate</th>
                <th className="p-4">Job / Post</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading applicant data...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No applications found.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-sky-800">{app.application_no}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{app.candidate_name}</div>
                      <div className="text-xs text-slate-500">{app.candidate_email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{app.job_title}</div>
                      <div className="text-xs text-slate-500">{app.job_code}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                        {app.candidate_category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700' :
                        app.status === 'Admit Card Issued' ? 'bg-sky-50 text-sky-700' :
                        app.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-700' :
                        app.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setNewStatus(app.status);
                          setReviewNotes(app.review_notes || '');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Review
                      </button>

                      <button
                        onClick={() => setAdmitModalApp(app)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Issue Admit Card"
                      >
                        Admit Card
                      </button>

                      <button
                        onClick={() => setResultModalApp(app)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Publish Exam Score"
                      >
                        Publish Result
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Status Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Review Application</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedApp.application_no} - {selectedApp.candidate_name}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Application Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Admit Card Issued">Admit Card Issued</option>
                  <option value="Exam Completed">Exam Completed</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Official Review Notes</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Verified educational qualification degrees and caste quota certificate."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white rounded-xl shadow-sm disabled:opacity-50"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admit Card Modal */}
      {admitModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Issue E-Admit Card</h3>
                <p className="text-xs text-slate-500">{admitModalApp.application_no} | {admitModalApp.candidate_name}</p>
              </div>
              <button onClick={() => setAdmitModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueAdmitCard} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Assigned Exam Center</label>
                <input
                  type="text"
                  required
                  value={admitData.examCenter}
                  onChange={(e) => setAdmitData({ ...admitData, examCenter: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Reporting Time</label>
                <input
                  type="text"
                  required
                  value={admitData.reportingTime}
                  onChange={(e) => setAdmitData({ ...admitData, reportingTime: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Candidate Instructions</label>
                <textarea
                  rows={3}
                  value={admitData.instructions}
                  onChange={(e) => setAdmitData({ ...admitData, instructions: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdmitModalApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl shadow-sm disabled:opacity-50"
                >
                  Generate & Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Result Publishing Modal */}
      {resultModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Publish Examination Score</h3>
                <p className="text-xs text-slate-500">{resultModalApp.application_no} | {resultModalApp.candidate_name}</p>
              </div>
              <button onClick={() => setResultModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishResult} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Marks Obtained (out of 100)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={resultData.marksObtained}
                    onChange={(e) => setResultData({ ...resultData, marksObtained: e.target.value })}
                    placeholder="e.g. 78.5"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Merit Rank (Optional)</label>
                  <input
                    type="number"
                    value={resultData.rank}
                    onChange={(e) => setResultData({ ...resultData, rank: e.target.value })}
                    placeholder="e.g. 14"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Qualification Outcome</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={resultData.isQualified}
                      onChange={() => setResultData({ ...resultData, isQualified: true })}
                    />
                    Qualified
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={!resultData.isQualified}
                      onChange={() => setResultData({ ...resultData, isQualified: false })}
                    />
                    Not Qualified
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Remarks</label>
                <input
                  type="text"
                  value={resultData.remarks}
                  onChange={(e) => setResultData({ ...resultData, remarks: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResultModalApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm disabled:opacity-50"
                >
                  Publish Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

