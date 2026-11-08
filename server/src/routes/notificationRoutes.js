const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/announcements', notificationController.getAnnouncements);
router.get('/my-notifications', authenticateToken, requireRole(['CANDIDATE']), notificationController.getCandidateNotifications);
router.patch('/my-notifications/:id/read', authenticateToken, requireRole(['CANDIDATE']), notificationController.markNotificationAsRead);

module.exports = router;

