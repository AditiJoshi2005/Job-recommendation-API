const Job = require('../models/Job');

const WEIGHTS = {
  REQUIRED_SKILL_MATCH: 60,
  PREFERRED_SKILL_MATCH: 25,
  EXPERIENCE_MATCH: 15,
};

function scoreRequiredSkills(userSkills, requiredSkills) {
  if (requiredSkills.length === 0)
    return { score: WEIGHTS.REQUIRED_SKILL_MATCH, matched: [], missing: [] };

  const matched = requiredSkills.filter((s) => userSkills.includes(s));
  const missing = requiredSkills.filter((s) => !userSkills.includes(s));
  const score = parseFloat(((matched.length / requiredSkills.length) * WEIGHTS.REQUIRED_SKILL_MATCH).toFixed(2));
  return { score, matched, missing };
}

function scorePreferredSkills(userSkills, preferredSkills) {
  if (preferredSkills.length === 0) return WEIGHTS.PREFERRED_SKILL_MATCH;
  const matched = preferredSkills.filter((s) => userSkills.includes(s));
  return parseFloat(((matched.length / preferredSkills.length) * WEIGHTS.PREFERRED_SKILL_MATCH).toFixed(2));
}

function scoreExperience(userExp, requiredExp) {
  if (requiredExp === 0) return WEIGHTS.EXPERIENCE_MATCH;
  if (userExp >= requiredExp) return WEIGHTS.EXPERIENCE_MATCH;
  const gap = requiredExp - userExp;
  if (gap > 1) return 0;
  return parseFloat(((1 - gap) * WEIGHTS.EXPERIENCE_MATCH).toFixed(2));
}

async function getRecommendations(user, limit = 10, minScore = 30) {
  const startTime = Date.now();
  const userSkills = user.skills.map((s) => s.toLowerCase().trim());

  const jobs = await Job.find({ isActive: true, requiredSkills: { $in: userSkills } }).lean();

  const scoredJobs = [];

  for (const job of jobs) {
    const req = scoreRequiredSkills(userSkills, job.requiredSkills);
    const pref = scorePreferredSkills(userSkills, job.preferredSkills);
    const exp = scoreExperience(user.experience, job.experienceRequired);
    const total = parseFloat((req.score + pref + exp).toFixed(2));

    if (total >= minScore) {
      scoredJobs.push({
        job,
        matchScore: total,
        matchedSkills: req.matched,
        missingSkills: req.missing,
        matchPercentage: `${total.toFixed(2)}%`,
      });
    }
  }

  scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

  return {
    userId: user._id.toString(),
    userSkills,
    totalJobsAnalyzed: jobs.length,
    recommendations: scoredJobs.slice(0, limit),
    generatedAt: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
  };
}

function analyzeSkillGaps(userSkills, jobs) {
  const freq = {};
  for (const job of jobs) {
    for (const skill of [...job.requiredSkills, ...job.preferredSkills]) {
      if (!userSkills.includes(skill)) freq[skill] = (freq[skill] || 0) + 1;
    }
  }
  return Object.fromEntries(Object.entries(freq).sort(([, a], [, b]) => b - a));
}

module.exports = { getRecommendations, analyzeSkillGaps };