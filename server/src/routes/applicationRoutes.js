const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Candidate actions
router.post('/apply', authenticateToken, requireRole(['CANDIDATE']), applicationController.applyToJob);
router.get('/my-applications', authenticateToken, requireRole(['CANDIDATE']), applicationController.getCandidateApplications);

// Admin & HR management
router.get('/', authenticateToken, requireRole(['ADMIN', 'HR_OFFICER']), applicationController.getAllApplications);
router.patch('/:id/status', authenticateToken, requireRole(['ADMIN', 'HR_OFFICER']), applicationController.updateApplicationStatus);

module.exports = router;

