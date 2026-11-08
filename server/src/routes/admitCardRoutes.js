const express = require('express');
const router = express.Router();
const admitCardController = require('../controllers/admitCardController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/application/:applicationId', authenticateToken, admitCardController.getAdmitCardByApplication);
router.post('/issue', authenticateToken, requireRole(['ADMIN', 'HR_OFFICER']), admitCardController.issueAdmitCard);

module.exports = router;

