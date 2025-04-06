// backend/controllers/chainsController.js
const pool = require('../db');

const getAllChains = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotelchain ORDER BY chain_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hotel chains:', err);
    res.status(500).json({ error: 'Failed to fetch hotel chains' });
  }
};

const addChain = async (req, res) => {
    const { chain_id, name, headquarters_address, contact_email, contact_phone } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO hotelchain (chain_id, name, headquarters_address, contact_email, contact_phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [chain_id, name, headquarters_address, contact_email, contact_phone]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding chain:', err);
      res.status(500).json({ error: 'Failed to add chain' });
    }
  };

  const deleteChain = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'DELETE FROM hotelchain WHERE chain_id = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Chain not found' });
      }
      res.json({ message: 'Chain deleted', chain: result.rows[0] });
    } catch (err) {
      console.error('Error deleting chain:', err);
      res.status(500).json({ error: 'Failed to delete chain' });
    }
  };

module.exports = { getAllChains, addChain, deleteChain };
