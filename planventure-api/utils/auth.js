import jwt from 'jsonwebtoken';

export function verifyToken(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token missing' });
    return null;
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return { id: decoded.id };
  } catch (err) {
      return null;
  }
}