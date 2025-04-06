// backend/controllers/chainsController.js
const pool = require('../db');

const getAllChains = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotel_chain ORDER BY chain_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hotel chains:', err);
    res.status(500).json({ error: 'Failed to fetch hotel chains' });
  }
};

const addChain = async (req, res) => {
  const { chain_id, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO hotel_chain (chain_id, name) VALUES ($1, $2) RETURNING *',
      [chain_id, name]
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
      'DELETE FROM hotel_chain WHERE chain_id = $1 RETURNING *',
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
