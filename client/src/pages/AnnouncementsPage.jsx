import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, Calendar, Search, FileText } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnouncements()
      .then(data => setAnnouncements(data.announcements || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = announcements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Official Announcements & Circulars</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Stay updated with public recruitment notifications, CBT schedules, scorecard announcements, and syllabus updates.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search circulars by keywords..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium text-slate-700"
        >
          <option value="">All Categories</option>
          <option value="RECRUITMENT">Recruitment</option>
          <option value="EXAM">Examination</option>
          <option value="RESULT">Results</option>
          <option value="GENERAL">General</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading announcements...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">No circulars match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm hover:border-sky-300 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

