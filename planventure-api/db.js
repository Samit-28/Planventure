import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Reuse pool across invocations
let pool;

if (!global.pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Neon
  });
  global.pool = pool;
} else {
  pool = global.pool;
}

pool.on('connect', () => console.log('✅ Connected to PostgreSQL database'));
pool.on('error', (err) => console.error('Database error', err));

export default pool;