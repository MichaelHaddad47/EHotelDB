const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ehotels',
  password: 'postgres',
  port: 5432,
});

const chains = [
  { name: 'Star Hotels', address: '100 Galaxy Rd', email: 'star@chain.com', phone: '111-111-1111' },
  { name: 'Skyline Group', address: '200 Cloud Ave', email: 'sky@chain.com', phone: '222-222-2222' },
  { name: 'Oceanic Inns', address: '300 Wave Blvd', email: 'ocean@chain.com', phone: '333-333-3333' },
  { name: 'Forest Retreats', address: '400 Pine Ln', email: 'forest@chain.com', phone: '444-444-4444' },
  { name: 'Urban Sleepers', address: '500 City St', email: 'urban@chain.com', phone: '555-555-5555' }
];

const hotelZones = ['Downtown Ottawa', 'Toronto North', 'Montreal Center', 'Quebec City', 'Vancouver Bay'];
const hotelCategories = [1, 2, 3, 4, 5];

const staffNames = [
  'Alice Johnson', 'Bob Lee', 'Chris Park', 'Emma Garcia', 'Clara Zhang', 'David Kim', 'Isla White', 'Jason Lee',
  'Charlie Evans', 'Dana Brooks', 'Kevin Stone', 'Tina Bell', 'Eli Thompson', 'Fay Miller', 'Noah Carter', 'Lily Adams',
  'Grace Nelson', 'Henry Scott', 'Olivia Hayes', 'James Moore', 'Sophia Lee', 'Jack Hill', 'Zara Blake', 'Leo Ford'
];

(async () => {
  try {
    await client.connect();

    // Reset tables
    await client.query('TRUNCATE rental, reservation, employee, guest, room, hotel, hotelchain RESTART IDENTITY CASCADE');
    console.log("✅ Tables reset.");

    // Hotel Chains
    console.log("Seeding Hotel Chains...");
    for (const chain of chains) {
      await client.query(`
        INSERT INTO HotelChain (name, headquarters_address, contact_email, contact_phone)
        VALUES ($1, $2, $3, $4)
      `, [chain.name, chain.address, chain.email, chain.phone]);
    }

    // Hotels
    let hotelCounter = 1;
    console.log("Seeding Hotels...");
    for (let i = 0; i < chains.length; i++) {
      for (let j = 0; j < 8; j++) {
        const address = `${hotelZones[j % hotelZones.length]} - ${chains[i].name.split(' ')[0]} Hotel ${j + 1}`;
        const email = `hotel${hotelCounter}@${chains[i].name.split(' ')[0].toLowerCase()}.com`;
        const phone = `613-000-${1000 + hotelCounter}`;
        const category = hotelCategories[j % hotelCategories.length];
        await client.query(`
          INSERT INTO Hotel (chain_id, address, category, contact_email, contact_phone, total_rooms)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [i + 1, address, category, email, phone, 5]);
        hotelCounter++;
      }
    }

    // Rooms
    console.log("Seeding Rooms...");
    for (let hotelId = 1; hotelId <= 40; hotelId++) {
      for (let r = 1; r <= 5; r++) {
        const price = 90 + Math.floor(Math.random() * 100);
        const capacity = r;
        const area = 18 + r * 5;
        const sea = r % 2 === 0;
        const mountain = r % 3 === 0;
        const extend = r % 2 === 1;
        const damages = r === 3 ? ['Broken lamp', 'Leaky faucet', 'Stained carpet', 'Cracked mirror', 'Damaged curtains'][hotelId % 5] : null;

        await client.query(`
          INSERT INTO Room (hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [hotelId, price, capacity, area, sea, mountain, extend, damages]);
      }
    }

    // Employees
    console.log("Seeding Employees...");
let empIndex = 0;
for (let hotelId = 1; hotelId <= 40; hotelId++) {
  const managerName = staffNames[empIndex++ % staffNames.length];
  const managerEmail = `${managerName.toLowerCase().split(' ').join('.')}@hotel.com`;
  const managerPassword = '1234'; // You can improve this later with hashing

  await client.query(`
    INSERT INTO Employee (hotel_id, full_name, address, social_security_number, role, email, password)
    VALUES ($1, $2, $3, $4, 'manager', $5, $6)
  `, [hotelId, managerName, `Manager Address ${hotelId}`, `100-${hotelId}-000`, managerEmail, managerPassword]);

  const staffCount = 3 + Math.floor(Math.random() * 3); // 3 to 5 staff
  for (let s = 0; s < staffCount; s++) {
    const staffName = staffNames[empIndex++ % staffNames.length];
    const staffEmail = `${staffName.toLowerCase().split(' ').join('.')}@hotel.com`;
    const staffPassword = 'password'; // Also dummy for now

    await client.query(`
      INSERT INTO Employee (hotel_id, full_name, address, social_security_number, role, email, password)
      VALUES ($1, $2, $3, $4, 'staff', $5, $6)
    `, [hotelId, staffName, `Staff Address ${hotelId}-${s}`, `200-${hotelId}-${s}`, staffEmail, staffPassword]);
  }
}

    // Guests
    console.log("Seeding Guests...");
    const guestData = [
      ['John Doe', '123 Main St', '999-999-999'],
      ['Jane Smith', '124 Main St', '888-888-888'],
      ['Mike Jordan', '125 Main St', '777-777-777'],
      ['Sara Connor', '126 Main St', '666-666-666'],
      ['Tom Riddle', '127 Main St', '555-555-555'],
    ];
    for (const guest of guestData) {
      await client.query(`
        INSERT INTO Guest (full_name, address, social_security_number, checkin_date)
        VALUES ($1, $2, $3, CURRENT_DATE)
      `, guest);
    }

    // Reservation & Rental
    console.log("Seeding Reservation and Rental...");
    await client.query(`
      INSERT INTO Reservation (start_date, end_date, status, guest_id, room_id)
      VALUES (CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 'booked', 1, 1)
    `);

    await client.query(`
      INSERT INTO Rental (reservation_id, guest_id, employee_id, start_date, end_date, payment_status, room_id)
      VALUES (1, 1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', TRUE, 1)
    `);

    console.log("🎉 Done seeding everything!");
    await client.end();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    await client.end();
  }
})();
