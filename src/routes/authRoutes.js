const { Router } = require('express');
const { register, login, getMe, updateSkills } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-skills', protect, updateSkills);
module.exports = router;