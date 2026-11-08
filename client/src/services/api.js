const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom auth event or let AuthContext handle
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // Jobs
  getJobs: (params = '') => request(`/jobs${params ? `?${params}` : ''}`),
  getJobById: (id) => request(`/jobs/${id}`),
  createJob: (jobData) => request('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
  updateJob: (id, jobData) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(jobData) }),

  // Applications
  apply: (jobId) => request('/applications/apply', { method: 'POST', body: JSON.stringify({ jobId }) }),
  getMyApplications: () => request('/applications/my-applications'),
  getAllApplications: (params = '') => request(`/applications${params ? `?${params}` : ''}`),
  updateApplicationStatus: (id, status, notes) => 
    request(`/applications/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status, review_notes: notes }) 
    }),

  // Admit Cards
  getAdmitCard: (applicationId) => request(`/admit-cards/application/${applicationId}`),
  issueAdmitCard: (payload) => request('/admit-cards/issue', { method: 'POST', body: JSON.stringify(payload) }),

  // Results
  getMyResults: () => request('/results/my-results'),
  publishResult: (payload) => request('/results/publish', { method: 'POST', body: JSON.stringify(payload) }),

  // Notifications & Announcements
  getAnnouncements: () => request('/notifications/announcements'),
  getMyNotifications: () => request('/notifications/my-notifications'),
  markNotificationRead: (id) => request(`/notifications/my-notifications/${id}/read`, { method: 'PATCH' }),

  // Analytics
  getAnalytics: () => request('/analytics/dashboard')
};

