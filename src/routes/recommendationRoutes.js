const { Router } = require('express');
const { getMyRecommendations, getSkillGaps } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

const router = Router();
router.get('/', protect, getMyRecommendations);
router.get('/skill-gaps', protect, getSkillGaps);
module.exports = router;