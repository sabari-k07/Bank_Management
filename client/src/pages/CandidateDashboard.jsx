import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  FileText, 
  Download, 
  Award, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  X,
  Building2,
  Calendar,
  MapPin,
  User,
  ShieldCheck
} from 'lucide-react';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [selectedAdmitCard, setSelectedAdmitCard] = useState(null);
  const [admitCardLoading, setAdmitCardLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getMyApplications(),
      api.getMyResults(),
      api.getMyNotifications()
    ])
      .then(([appData, resData, notifData]) => {
        setApplications(appData.applications || []);
        setResults(resData.results || []);
        setNotifications(notifData.notifications || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleViewAdmitCard = async (appId) => {
    setAdmitCardLoading(true);
    try {
      const data = await api.getAdmitCard(appId);
      setSelectedAdmitCard(data.admitCard);
    } catch (err) {
      alert(err.message || 'Admit card not found.');
    } finally {
      setAdmitCardLoading(false);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Admit Card Issued':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Shortlisted':
      case 'Interview':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-2xl backdrop-blur-sm">
            {user?.profile?.full_name ? user.profile.full_name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold">{user?.profile?.full_name || user?.email}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/30">
                {user?.profile?.category || 'CANDIDATE'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
              <span>{user?.email}</span>
              <span>•</span>
              <span>{user?.profile?.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-center">
            <div className="text-xl font-bold">{applications.length}</div>
            <div className="text-[10px] text-slate-300 font-medium">Applied Jobs</div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-center">
            <div className="text-xl font-bold">{results.length}</div>
            <div className="text-[10px] text-slate-300 font-medium">Declared Results</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'applications'
              ? 'border-sky-700 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          My Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'results'
              ? 'border-sky-700 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Examination Scorecards ({results.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'notifications'
              ? 'border-sky-700 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications ({notifications.filter(n => !n.is_read).length} unread)
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading your portal records...</div>
      ) : activeTab === 'applications' ? (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">You have not submitted any applications yet.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {app.application_no}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{app.job_title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Code: {app.job_code}</span>
                      <span>•</span>
                      <span>{app.job_department}</span>
                      <span>•</span>
                      <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                    </p>
                  </div>

                  {app.review_notes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      <span className="font-semibold text-slate-700">Review Note:</span> {app.review_notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {app.admit_card_id && (
                    <button
                      onClick={() => handleViewAdmitCard(app.id)}
                      disabled={admitCardLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white shadow-sm transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Admit Card
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'results' ? (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No examination scorecards published yet.</p>
            </div>
          ) : (
            results.map((res) => (
              <div key={res.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500">App No: {res.application_no}</span>
                    <h3 className="text-lg font-bold text-slate-900">{res.job_title}</h3>
                    <p className="text-xs text-slate-500">{res.exam_name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    res.is_qualified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {res.is_qualified ? 'Qualified for Next Stage' : 'Not Qualified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block">Marks Obtained</span>
                    <span className="text-base font-bold text-slate-900">{res.marks_obtained} / {res.total_marks}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Cutoff / Passing</span>
                    <span className="text-base font-bold text-slate-900">{res.passing_marks}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Merit Rank</span>
                    <span className="text-base font-bold text-slate-900">{res.rank ? `#${res.rank}` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Declaration Date</span>
                    <span className="text-base font-bold text-slate-900">{new Date(res.published_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {res.remarks && (
                  <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <span className="font-semibold">Official Remarks:</span> {res.remarks}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">You have no new notifications.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-colors flex items-start justify-between gap-4 ${
                  notif.is_read ? 'bg-white border-slate-200' : 'bg-sky-50/50 border-sky-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-sky-600"></span>}
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
                {!notif.is_read && (
                  <button
                    onClick={() => handleMarkNotificationRead(notif.id)}
                    className="text-xs font-semibold text-sky-700 hover:underline shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Printable E-Admit Card Modal */}
      {selectedAdmitCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start print:hidden">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" /> Official Computerized E-Admit Card
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setSelectedAdmitCard(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Admit Card Paper Layout */}
            <div className="border-2 border-slate-800 rounded-2xl p-6 space-y-6 text-slate-900 font-sans">
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="text-xl font-black tracking-tight text-slate-900">APEX BANK RECRUITMENT CELL</div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-600">Online Preliminary Examination Admit Card</div>
                <div className="text-xs font-semibold text-slate-500">Recruitment Project 2026-27</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Roll Number</span>
                  <span className="text-sm font-mono font-black text-sky-800">{selectedAdmitCard.roll_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Registration No</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{selectedAdmitCard.application_no}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Candidate Name</span>
                  <span className="text-sm font-bold text-slate-900">{selectedAdmitCard.candidate_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date of Birth</span>
                  <span className="font-semibold">{selectedAdmitCard.date_of_birth}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Category</span>
                  <span className="font-semibold">{selectedAdmitCard.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Post Applied</span>
                  <span className="font-semibold">{selectedAdmitCard.job_title}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Exam Date & Time:</span>
                  <span className="font-bold text-slate-900">{selectedAdmitCard.exam_date} | {selectedAdmitCard.exam_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reporting Time:</span>
                  <span className="font-bold text-rose-600">{selectedAdmitCard.reporting_time} (Strict Gate Closure)</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Assigned Examination Center:</span>
                  <span className="font-semibold text-slate-900 block bg-white p-2 rounded border border-slate-200">
                    {selectedAdmitCard.exam_center}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200 pt-3">
                <div className="font-bold text-slate-800 uppercase">Important Candidate Instructions:</div>
                <p className="whitespace-pre-line leading-relaxed">{selectedAdmitCard.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

