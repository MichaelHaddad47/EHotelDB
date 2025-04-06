const express = require('express');
const cors = require('cors');
const app = express();
const roomsRoutes = require('./routes/rooms');
const guestRoutes = require('./routes/guests');
const reservationRoutes = require('./routes/reservations');
const employeeRoutes = require('./routes/employees');
const rentalRoutes = require('./routes/rentals');
const archiveRoutes = require('./routes/archive');
const chainsRoutes = require('./routes/chains');

app.use(cors());
app.use(express.json());
app.use('/rooms', roomsRoutes);
app.use('/guests', guestRoutes);
app.use('/reservations', reservationRoutes);
app.use('/employees', employeeRoutes);
app.use('/rentals', rentalRoutes);
app.use('/archive', archiveRoutes);
app.use('/chains', chainsRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
