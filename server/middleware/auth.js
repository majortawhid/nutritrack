import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and attach to request
    const user = await User.findOne({
      _id: decoded.userId,
      // You could add additional checks here like:
      // 'tokens.token': token // For token invalidation
    });

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;