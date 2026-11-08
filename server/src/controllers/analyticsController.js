const { get, all } = require('../config/db');

function getDashboardAnalytics(req, res) {
  try {
    const totalJobs = get('SELECT count(*) as count FROM jobs').count;
    const activeJobs = get('SELECT count(*) as count FROM jobs WHERE status = "OPEN"').count;
    const totalCandidates = get('SELECT count(*) as count FROM candidate_profiles').count;
    const totalApplications = get('SELECT count(*) as count FROM applications').count;

    const statusBreakdown = all(`
      SELECT status, count(*) as count 
      FROM applications 
      GROUP BY status
    `);

    const jobApplications = all(`
      SELECT j.id, j.job_code, j.title, j.vacancies, count(a.id) as application_count
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY j.id
      ORDER BY application_count DESC
    `);

    const recentApplications = all(`
      SELECT 
        a.id, a.application_no, a.status, a.applied_at,
        j.job_code, j.title as job_title,
        cp.full_name as candidate_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN candidate_profiles cp ON a.candidate_id = cp.id
      ORDER BY a.applied_at DESC
      LIMIT 10
    `);

    return res.json({
      summary: {
        totalJobs,
        activeJobs,
        totalCandidates,
        totalApplications
      },
      statusBreakdown,
      jobApplications,
      recentApplications
    });
  } catch (err) {
    console.error('getDashboardAnalytics error:', err);
    return res.status(500).json({ error: 'Failed to compute administrative metrics.' });
  }
}

module.exports = {
  getDashboardAnalytics
};

