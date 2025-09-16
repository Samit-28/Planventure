import pool from '../db.js';
import bcrypt from 'bcrypt';

export async function createUser(email, password) {
    const hashed = await bcrypt.hash(password, 10);
    const res = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hashed]
    );
    return res.rows[0];
}

export async function findUserByEmail(email) {
    const res = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return res.rows[0];
}

export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}