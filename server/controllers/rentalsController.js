const pool = require('../db');

const createRental = async (req, res) => {
  const { reservation_id, guest_id, room_id, employee_id, start_date, end_date } = req.body;

  try {
    if (reservation_id) {
      // Convert existing reservation to rental
      const resCheck = await pool.query(
        'SELECT * FROM reservation WHERE reservation_id = $1 AND status = $2',
        [reservation_id, 'booked']
      );

      if (resCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Reservation not found or already used' });
      }

      const reservation = resCheck.rows[0]; // 👈 get the reservation

      // Create rental from reservation
      const result = await pool.query(
        `INSERT INTO rental (reservation_id, guest_id, employee_id, start_date, end_date, room_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          reservation_id,
          reservation.guest_id,     // 👈 use from DB not client
          employee_id,
          reservation.start_date,
          reservation.end_date,
          reservation.room_id
        ]
      );

      return res.status(201).json(result.rows[0]);
    } else {
      // Direct rental (walk-in)
      const result = await pool.query(
        `INSERT INTO rental (guest_id, employee_id, start_date, end_date, room_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [guest_id, employee_id, start_date, end_date, room_id]
      );

      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Rental error:', err);
    res.status(500).json({ error: 'Could not create rental' });
  }
};

const markPaymentComplete = async (req, res) => {
    const rentalId = req.params.id;
  
    try {
      const result = await pool.query(
        'UPDATE rental SET payment_status = true WHERE rental_id = $1 RETURNING *',
        [rentalId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Rental not found' });
      }
  
      res.status(200).json({ message: 'Payment marked as complete', rental: result.rows[0] });
    } catch (err) {
      console.error('Error updating payment status:', err);
      res.status(500).json({ error: 'Could not update payment status' });
    }
  };

module.exports = {
    createRental,
    markPaymentComplete
};