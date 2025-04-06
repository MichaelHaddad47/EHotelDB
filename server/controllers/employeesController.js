const pool = require('../db');

const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM employee WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const employee = result.rows[0];
    res.status(200).json({
      message: 'Login successful',
      employee_id: employee.employee_id,
      name: employee.full_name,
      role: employee.role,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { loginEmployee };
