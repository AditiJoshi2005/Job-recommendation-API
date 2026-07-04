const User = require('../models/User');
const Job = require('../models/Job');
const { getRecommendations, analyzeSkillGaps } = require('../services/scoringService');

const getMyRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const minScore = parseInt(req.query.minScore) || 30;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!user.skills.length)
      return res.status(400).json({ success: false, message: 'Add your skills first.' });

    const result = await getRecommendations(user, limit, minScore);
    res.status(200).json({ success: true, message: `${result.recommendations.length} recommendations in ${result.responseTimeMs}ms.`, data: result });
  } catch (error) { next(error); }
};

const getSkillGaps = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const jobs = await Job.find({ isActive: true }).lean();
    const gaps = analyzeSkillGaps(user.skills, jobs);
    const topGaps = Object.entries(gaps).slice(0, 15).map(([skill, count]) => ({ skill, demandCount: count }));

    res.status(200).json({ success: true, message: 'Skill gaps identified.', data: { userSkills: user.skills, topMissingSkills: topGaps } });
  } catch (error) { next(error); }
};

module.exports = { getMyRecommendations, getSkillGaps };