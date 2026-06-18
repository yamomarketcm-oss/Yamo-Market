import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken';

 const hashPassword = async (password) => bcryptjs.hash(password, 12);

 const comparePassword = async (password, hash) =>
  bcryptjs.compare(password, hash);

 const signJwt = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: '10h' });

 const verifyJwt = (market_token) => jwt.verify(market_token, process.env.JWT_SECRET);

export const requireAuth = (req, res, next) => {

  const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(404).json({ message: 'Missing token' });
      return;
    }

  try {
    const market_token = authHeader.split(' ')[1];
    const user = verifyJwt(market_token);
      req.user = { user_id: user.user_id, email: user.email, username: user.username, isAdmin: user.isAdmin, phone: user.phone };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};