const { all, get, run } = require('../config/db');

function getAnnouncements(req, res) {
  try {
    const list = all('SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC');
    return res.json({ announcements: list });
  } catch (err) {
    console.error('getAnnouncements error:', err);
    return res.status(500).json({ error: 'Failed to load announcements.' });
  }
}

function getCandidateNotifications(req, res) {
  try {
    const profile = get('SELECT id FROM candidate_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.json({ notifications: [] });
    }

    const list = all(
      'SELECT * FROM candidate_notifications WHERE candidate_id = ? ORDER BY created_at DESC',
      [profile.id]
    );
    return res.json({ notifications: list });
  } catch (err) {
    console.error('getCandidateNotifications error:', err);
    return res.status(500).json({ error: 'Failed to fetch candidate notifications.' });
  }
}

function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const profile = get('SELECT id FROM candidate_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(404).json({ error: 'Candidate profile not found.' });
    }

    run('UPDATE candidate_notifications SET is_read = 1 WHERE id = ? AND candidate_id = ?', [id, profile.id]);
    return res.json({ message: 'Notification marked as read.' });
  } catch (err) {
    console.error('markNotificationAsRead error:', err);
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
}

module.exports = {
  getAnnouncements,
  getCandidateNotifications,
  markNotificationAsRead
};

