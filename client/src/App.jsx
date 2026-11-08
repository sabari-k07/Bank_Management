import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnnouncementsPage from './pages/AnnouncementsPage';
import { Building2, ShieldCheck, Mail, Phone } from 'lucide-react';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Verifying authorization...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Building2 className="w-5 h-5 text-sky-400" />
            Apex Bank Recruitment Board
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            Statutory Recruitment Body managing computerized merit selections, probationary officer inductions, and banking cadres.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2">
            <li><a href="/jobs" className="hover:text-white transition-colors">Career Openings</a></li>
            <li><a href="/announcements" className="hover:text-white transition-colors">Official Circulars</a></li>
            <li><a href="/login" className="hover:text-white transition-colors">Candidate Login</a></li>
            <li><a href="/register" className="hover:text-white transition-colors">Online Registration</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Security & Compliance</h4>
          <ul className="space-y-2 text-slate-500 text-[11px]">
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encryption</li>
            <li>ISO 27001 Certified Infrastructure</li>
            <li>Anti-Impersonation Biometric Verification</li>
            <li>Zero Paper Recruitment Protocol</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Helpdesk & Support</h4>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> recruitment@apexbank.com</li>
            <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> 1800-425-2026 (Toll-Free, 9AM-6PM)</li>
            <li className="text-slate-500 pt-1">Apex Towers, Financial District, Hyderabad</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 text-center text-slate-600 text-[11px]">
        © {new Date().getFullYear()} Apex Bank Ltd. All rights reserved. Recruitment Software Engine v2.0.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />

              {/* Protected Candidate Route */}
              <Route
                path="/candidate/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['CANDIDATE']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin & HR Route */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'HR_OFFICER']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

