import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Users, 
  FileCheck2, 
  ChevronRight,
  Sparkles,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getJobs('status=OPEN'),
      api.getAnnouncements()
    ])
      .then(([jobsData, annData]) => {
        setFeaturedJobs(jobsData.jobs ? jobsData.jobs.slice(0, 3) : []);
        setAnnouncements(annData.announcements ? annData.announcements.slice(0, 3) : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-900/60 border border-sky-400/30 text-sky-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Recruitment Drive 2026-27 Open
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Build Your Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">Apex Bank</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Apply online for Officer Cadre and Clerical appointments across our nationwide branch network. Merit-based, transparent, and digital-first selection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
            >
              <Briefcase className="w-4 h-4" />
              Explore Open Vacancies
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm backdrop-blur-sm transition-all"
            >
              New Candidate Registration
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">245+</div>
              <div className="text-xs text-slate-400 font-medium">Total Open Vacancies</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Digital CBT Selection</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">30+</div>
              <div className="text-xs text-slate-400 font-medium">Regional Exam Zones</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">Grade I/II</div>
              <div className="text-xs text-slate-400 font-medium">Competitive Pay Scale</div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Ticker */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Recruitment Notices
            </div>
            <Link to="/announcements" className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1">
              View All Notices <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {announcements.map((item) => (
              <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
                    {item.category}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 hover:text-sky-700 cursor-pointer">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.content}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Positions Available</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Job Openings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 group"
          >
            Browse All Positions <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-700">
                    {job.job_code}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {job.vacancies} Posts
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {job.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {job.department}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-700">Pay Scale: </span>
                    {job.salary_grade}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Age Limit: </span>
                    {job.min_age} - {job.max_age} Years
                  </div>
                  <div className="flex items-center gap-1 text-rose-600 font-medium">
                    <Clock className="w-3 h-3" />
                    Deadline: {job.end_date}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/jobs"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-700 hover:text-white transition-colors"
                >
                  View Details & Apply
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recruitment Process Workflow */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Clear & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruitment Process Flow
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Follow our structured 4-step recruitment journey from online application to final bank appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h4 className="font-bold text-base mb-2">Online Application</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Register profile, input qualification records, verify age eligibility, and submit your application.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h4 className="font-bold text-base mb-2">Admit Card Release</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download digital e-Admit Card with assigned test center venue, roll number, and reporting schedule.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h4 className="font-bold text-base mb-2">CBT Examination</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Appear for Computer-Based Test at authorized test centers. Real-time computerized evaluation.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h4 className="font-bold text-base mb-2">Results & Selection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Merit list publication, scorecard declaration, document verification, and appointment letter rollout.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

