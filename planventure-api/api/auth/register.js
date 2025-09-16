import { setCorsHeaders } from '../../utils/cors.js';
import { createUser, findUserByEmail } from '../../models/user.js';
import { validateEmail } from '../../utils/validators.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return; // handle OPTIONS

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing required fields' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.status(409).json({ error: 'Email already registered' });

  try {
    const user = await createUser(email, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
}
