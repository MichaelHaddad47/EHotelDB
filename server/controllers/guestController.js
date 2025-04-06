const pool = require('../db');

const registerGuest = async (req, res) => {
  const { full_name, address, social_security_number } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO guest (full_name, address, social_security_number, checkin_date)
       VALUES ($1, $2, $3, CURRENT_DATE)
       RETURNING *`,
      [full_name, address, social_security_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registering guest:', err);
    res.status(500).json({ error: 'Could not register guest' });
  }
};

module.exports = { registerGuest };
