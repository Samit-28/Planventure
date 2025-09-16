// api/trips/index.js
import db from '../../db.js';
import { verifyToken } from '../../utils/auth.js';
import { generateDefaultItinerary } from '../../utils/itinerary.js';
import { setCorsHeaders } from '../../utils/cors.js';

export default async function handler(req, res) {
  // Handle CORS
  if (setCorsHeaders(req, res)) return; // Stop if OPTIONS request

  try {
    const user = verifyToken(req, res);
    if (!user) return; // Token invalid, response already sent

    const userId = user.id;
    const { method, query, body } = req;
    const tripId = query.id ? parseInt(query.id) : null;

    // ---------------- POST /api/trips ----------------
    if (method === 'POST') {
      const { destination, start_date, end_date, latitude, longitude, itinerary } = body;

      if (!destination || !start_date || !end_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const tripItinerary = itinerary || generateDefaultItinerary(startDate, endDate);

      const queryText = `
        INSERT INTO trips
          (user_id, destination, start_date, end_date, latitude, longitude, itinerary)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, destination, start_date, end_date, latitude, longitude, itinerary
      `;
      const values = [userId, destination, startDate.toISOString(), endDate.toISOString(), latitude || null, longitude || null, tripItinerary];

      const result = await db.query(queryText, values);
      return res.status(201).json({ message: 'Trip created successfully', trip: result.rows[0] });
    }

    // ---------------- GET /api/trips ----------------
    if (method === 'GET' && !tripId) {
      const queryText = `
        SELECT id, destination, start_date, end_date, latitude, longitude, itinerary
        FROM trips
        WHERE user_id = $1
        ORDER BY start_date DESC
      `;
      const result = await db.query(queryText, [userId]);
      return res.status(200).json({ trips: result.rows });
    }

    // ---------------- GET /api/trips/:id ----------------
    if (method === 'GET' && tripId) {
      const queryText = `
        SELECT id, destination, start_date, end_date, latitude, longitude, itinerary
        FROM trips
        WHERE id = $1 AND user_id = $2
      `;
      const result = await db.query(queryText, [tripId, userId]);
      if (!result.rows.length) return res.status(404).json({ error: 'Trip not found' });
      return res.status(200).json(result.rows[0]);
    }

    // ---------------- PUT /api/trips/:id ----------------
    if (method === 'PUT' && tripId) {
      const { destination, start_date, end_date, latitude, longitude, itinerary } = body;

      const tripResult = await db.query('SELECT * FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
      if (!tripResult.rows.length) return res.status(404).json({ error: 'Trip not found' });
      const currentTrip = tripResult.rows[0];

      const startDate = start_date ? new Date(start_date) : new Date(currentTrip.start_date);
      const endDate = end_date ? new Date(end_date) : new Date(currentTrip.end_date);
      const tripItinerary = itinerary || currentTrip.itinerary || generateDefaultItinerary(startDate, endDate);

      const updateQuery = `
        UPDATE trips
        SET destination = $1, start_date = $2, end_date = $3, latitude = $4, longitude = $5, itinerary = $6
        WHERE id = $7 AND user_id = $8
        RETURNING id, destination, start_date, end_date, latitude, longitude, itinerary
      `;
      const values = [
        destination || currentTrip.destination,
        startDate.toISOString(),
        endDate.toISOString(),
        latitude ?? currentTrip.latitude,
        longitude ?? currentTrip.longitude,
        tripItinerary,
        tripId,
        userId
      ];
      const result = await db.query(updateQuery, values);
      return res.status(200).json({ message: 'Trip updated successfully', trip: result.rows[0] });
    }

    // ---------------- DELETE /api/trips/:id ----------------
    if (method === 'DELETE' && tripId) {
      const delQuery = 'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id';
      const result = await db.query(delQuery, [tripId, userId]);
      if (!result.rows.length) return res.status(404).json({ error: 'Trip not found' });
      return res.status(200).json({ message: 'Trip deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Trips index handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
