const pool = require('../db');

const getAvailableRooms = async (req, res) => {
    const { start_date, end_date, capacity, max_price } = req.query;
  
    try {
      const result = await pool.query(
        `
        SELECT * FROM room
        WHERE room_id NOT IN (
          SELECT room_id FROM reservation
          WHERE (start_date, end_date) OVERLAPS ($1::DATE, $2::DATE)
        )
        AND room_id NOT IN (
          SELECT room_id FROM rental
          WHERE (start_date, end_date) OVERLAPS ($1::DATE, $2::DATE)
        )
        ${capacity ? 'AND capacity = $3' : ''}
        ${max_price ? (capacity ? 'AND price <= $4' : 'AND price <= $3') : ''}
        `,
        capacity && max_price
          ? [start_date, end_date, capacity, max_price]
          : capacity
          ? [start_date, end_date, capacity]
          : max_price
          ? [start_date, end_date, max_price]
          : [start_date, end_date]
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching available rooms:', err);
      res.status(500).json({ error: 'Could not fetch available rooms' });
    }
  };

  const updateRoomDamage = async (req, res) => {
    const roomId = parseInt(req.params.id);
    const { damage } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE room SET damages = $1 WHERE room_id = $2 RETURNING *',
        [damage || null, roomId]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating room damage:', err);
      res.status(500).json({ error: 'Failed to update damage' });
    }
  };

  const getAllRooms = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM room ORDER BY room_id');
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching all rooms:', err);
      res.status(500).json({ error: 'Failed to get all rooms' });
    }
  };
  

module.exports = { getAvailableRooms, updateRoomDamage, getAllRooms, };
