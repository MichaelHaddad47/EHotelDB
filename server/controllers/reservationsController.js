const pool = require('../db');

const createReservation = async (req, res) => {
  const { guest_id, room_id, start_date, end_date } = req.body;

  try {
    // First, make sure the room is available
    const availabilityCheck = await pool.query(
        `
        SELECT room_id, start_date, end_date FROM reservation
        WHERE room_id = $1 AND (start_date, end_date) OVERLAPS ($2::DATE, $3::DATE)
        UNION
        SELECT room_id, start_date, end_date FROM rental
        WHERE room_id = $1 AND (start_date, end_date) OVERLAPS ($2::DATE, $3::DATE)
        `,
        [room_id, start_date, end_date]
      );

    if (availabilityCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Room is not available for these dates' });
    }

    const result = await pool.query(
      `
      INSERT INTO reservation (guest_id, room_id, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, 'booked')
      RETURNING *
      `,
      [guest_id, room_id, start_date, end_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

const cancelReservation = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        'DELETE FROM reservation WHERE reservation_id = $1 RETURNING *',
        [id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
  
      res.json({ message: 'Reservation cancelled', reservation: result.rows[0] });
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      res.status(500).json({ error: 'Failed to cancel reservation' });
    }
};

const getAllReservations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservation ORDER BY reservation_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

module.exports = {
    createReservation,
    cancelReservation,
    getAllReservations,
};
