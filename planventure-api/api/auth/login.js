import { setCorsHeaders } from '../../utils/cors.js';
import { findUserByEmail, verifyPassword } from '../../models/user.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return; // handle OPTIONS

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing required fields' });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email } });
}
