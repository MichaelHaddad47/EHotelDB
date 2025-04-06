const pool = require('../db');

const archiveRental = async (req, res) => {
  const { rental_id } = req.params;

  try {
    // Step 1: Fetch rental
    const rental = await pool.query(
      'SELECT * FROM rental WHERE rental_id = $1',
      [rental_id]
    );

    if (rental.rows.length === 0) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    const data = rental.rows[0];

    // Step 2: Insert into ArchivedRental
    await pool.query(
      `INSERT INTO ArchivedRental (reservation_id, guest_id, employee_id, start_date, end_date, payment_status, room_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [data.reservation_id, data.guest_id, data.employee_id, data.start_date, data.end_date, data.payment_status, data.room_id]
    );

    // Step 3: Delete original
    await pool.query('DELETE FROM rental WHERE rental_id = $1', [rental_id]);

    res.status(200).json({ message: 'Rental archived successfully' });
  } catch (err) {
    console.error('Archive error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { archiveRental };
