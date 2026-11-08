const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/dashboard', authenticateToken, requireRole(['ADMIN', 'HR_OFFICER']), analyticsController.getDashboardAnalytics);

module.exports = router;

