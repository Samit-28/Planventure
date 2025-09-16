import pool from '../../db.js';
import { verifyToken } from '../../utils/auth.js';
import { generateDefaultItinerary } from '../../utils/itinerary.js';
import { setCorsHeaders } from '../../utils/cors.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (setCorsHeaders(req, res)) return;

  const user = verifyToken(req, res);
  if (!user) return;

  const { id } = req.query;

  try {
    // ---------------- GET single trip ----------------
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM trips WHERE id=$1 AND user_id=$2',
        [id, user.id]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'Trip not found' });

      return res.status(200).json(result.rows[0]);
    }

    // ---------------- PUT update trip ----------------
    else if (req.method === 'PUT') {
      const data = req.body;

      const tripRes = await pool.query(
        'SELECT * FROM trips WHERE id=$1 AND user_id=$2',
        [id, user.id]
      );
      if (!tripRes.rows.length) return res.status(404).json({ error: 'Trip not found' });

      const trip = tripRes.rows[0];

      const updatedTrip = {
        destination: data.destination || trip.destination,
        start_date: data.start_date || trip.start_date,
        end_date: data.end_date || trip.end_date,
        latitude: data.latitude ?? trip.latitude,
        longitude: data.longitude ?? trip.longitude,
        itinerary:
          data.itinerary ||
          generateDefaultItinerary(data.start_date || trip.start_date, data.end_date || trip.end_date),
      };

      await pool.query(
        `UPDATE trips SET destination=$1, start_date=$2, end_date=$3, latitude=$4, longitude=$5, itinerary=$6
         WHERE id=$7 AND user_id=$8`,
        [
          updatedTrip.destination,
          updatedTrip.start_date,
          updatedTrip.end_date,
          updatedTrip.latitude,
          updatedTrip.longitude,
          updatedTrip.itinerary,
          id,
          user.id,
        ]
      );

      return res.status(200).json({ message: 'Trip updated successfully', trip: updatedTrip });
    }

    // ---------------- DELETE trip ----------------
    else if (req.method === 'DELETE') {
      const delRes = await pool.query(
        'DELETE FROM trips WHERE id=$1 AND user_id=$2 RETURNING id',
        [id, user.id]
      );
      if (!delRes.rows.length) return res.status(404).json({ error: 'Trip not found' });

      return res.status(200).json({ message: 'Trip deleted successfully' });
    }

    // ---------------- Method not allowed ----------------
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Trip [id] handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
