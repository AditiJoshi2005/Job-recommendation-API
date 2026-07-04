const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res, next) => {
  try {
    const { name, email, password, skills, experience } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const user = await User.create({ name, email, password, skills, experience });
    const token = signToken(user._id.toString(), user.role);
    res.status(201).json({ success: true, message: 'Registered successfully.', data: { token, user } });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = signToken(user._id.toString(), user.role);
    res.status(200).json({ success: true, message: 'Login successful.', data: { token, user } });
  } catch (error) { next(error); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'Profile retrieved.', data: { user } });
  } catch (error) { next(error); }
};

const updateSkills = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'Skills updated.', data: { user } });
  } catch (error) { next(error); }
};

module.exports = { register, login, getMe, updateSkills };