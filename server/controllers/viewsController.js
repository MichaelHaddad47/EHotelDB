const db = require('../db');

const getAvailableRoomsByZone = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM available_rooms_zone');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRoomCapacityByHotel = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM RoomCapacityByHotel');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAvailableRoomsByZone,
  getRoomCapacityByHotel,
};
