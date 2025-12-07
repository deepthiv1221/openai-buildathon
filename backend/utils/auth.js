const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    return null;
  }
};

// Generate JWT token
exports.generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Alternative: get from cookie
  if (!token && req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = exports.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    // Get user from token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Middleware to check user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Middleware for rate limiting (basic implementation)
const loginAttempts = {};

exports.checkLoginAttempts = (req, res, next) => {
  const email = req.body.email;
  const now = Date.now();
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0, lockedUntil: null };
  }

  const attemptData = loginAttempts[email];

  // Check if account is locked
  if (attemptData.lockedUntil && attemptData.lockedUntil > now) {
    const minutesRemaining = Math.ceil((attemptData.lockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      message: `Account locked. Try again in ${minutesRemaining} minutes`
    });
  }

  // Reset if lock has expired
  if (attemptData.lockedUntil && attemptData.lockedUntil <= now) {
    attemptData.count = 0;
    attemptData.lockedUntil = null;
  }

  next();
};

// Update login attempts
exports.recordLoginAttempt = (email, success) => {
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0, lockedUntil: null };
  }

  if (success) {
    // Reset on successful login
    loginAttempts[email] = { count: 0, lockedUntil: null };
  } else {
    // Increment failed attempts
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 hours

    loginAttempts[email].count++;

    if (loginAttempts[email].count >= maxAttempts) {
      loginAttempts[email].lockedUntil = Date.now() + lockTime;
    }
  }
};
