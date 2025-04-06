--------------------------------------------------------------------------------------------------------
-- Reset data
TRUNCATE rental, reservation, employee, guest, room, hotel, hotelchain RESTART IDENTITY CASCADE;
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
-- Hotel Chains
INSERT INTO hotelchain (name, headquarters_address, contact_email, contact_phone) VALUES
('Star Hotels', '100 Galaxy Rd', 'star@chain.com', '111-111-1111'),
('Skyline Group', '200 Cloud Ave', 'sky@chain.com', '222-222-2222'),
('Oceanic Inns', '300 Wave Blvd', 'ocean@chain.com', '333-333-3333'),
('Forest Retreats', '400 Pine Ln', 'forest@chain.com', '444-444-4444'),
('Urban Sleepers', '500 City St', 'urban@chain.com', '555-555-5555');
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
INSERT INTO hotel (chain_id, address, category, contact_email, contact_phone, total_rooms) VALUES
-- Star Hotels
(1, 'Downtown Ottawa - 101 Main St', 3, 'hotel1@star.com', '613-000-1001', 5),
(1, 'Downtown Ottawa - 102 Main St', 4, 'hotel2@star.com', '613-000-1002', 5),
(1, 'Toronto - 201 King St', 5, 'hotel3@star.com', '613-000-1003', 5),
(1, 'Toronto - 202 King St', 3, 'hotel4@star.com', '613-000-1004', 5),
(1, 'Montreal - 301 Queen St', 2, 'hotel5@star.com', '613-000-1005', 5),
(1, 'Montreal - 302 Queen St', 1, 'hotel6@star.com', '613-000-1006', 5),
(1, 'Quebec - 401 Rue St', 3, 'hotel7@star.com', '613-000-1007', 5),
(1, 'Vancouver - 501 Ocean Dr', 4, 'hotel8@star.com', '613-000-1008', 5),

-- Skyline Group
(2, 'Downtown Ottawa - 103 Main St', 3, 'hotel1@sky.com', '613-000-2001', 5),
(2, 'Downtown Ottawa - 104 Main St', 4, 'hotel2@sky.com', '613-000-2002', 5),
(2, 'Toronto - 203 King St', 5, 'hotel3@sky.com', '613-000-2003', 5),
(2, 'Toronto - 204 King St', 3, 'hotel4@sky.com', '613-000-2004', 5),
(2, 'Montreal - 303 Queen St', 2, 'hotel5@sky.com', '613-000-2005', 5),
(2, 'Montreal - 304 Queen St', 1, 'hotel6@sky.com', '613-000-2006', 5),
(2, 'Quebec - 402 Rue St', 3, 'hotel7@sky.com', '613-000-2007', 5),
(2, 'Vancouver - 502 Ocean Dr', 4, 'hotel8@sky.com', '613-000-2008', 5),

-- Oceanic Inns
(3, 'Downtown Ottawa - 105 Main St', 3, 'hotel1@ocean.com', '613-000-3001', 5),
(3, 'Downtown Ottawa - 106 Main St', 4, 'hotel2@ocean.com', '613-000-3002', 5),
(3, 'Toronto - 205 King St', 5, 'hotel3@ocean.com', '613-000-3003', 5),
(3, 'Toronto - 206 King St', 3, 'hotel4@ocean.com', '613-000-3004', 5),
(3, 'Montreal - 305 Queen St', 2, 'hotel5@ocean.com', '613-000-3005', 5),
(3, 'Montreal - 306 Queen St', 1, 'hotel6@ocean.com', '613-000-3006', 5),
(3, 'Quebec - 403 Rue St', 3, 'hotel7@ocean.com', '613-000-3007', 5),
(3, 'Vancouver - 503 Ocean Dr', 4, 'hotel8@ocean.com', '613-000-3008', 5),

-- Forest Retreats
(4, 'Downtown Ottawa - 107 Main St', 3, 'hotel1@forest.com', '613-000-4001', 5),
(4, 'Downtown Ottawa - 108 Main St', 4, 'hotel2@forest.com', '613-000-4002', 5),
(4, 'Toronto - 207 King St', 5, 'hotel3@forest.com', '613-000-4003', 5),
(4, 'Toronto - 208 King St', 3, 'hotel4@forest.com', '613-000-4004', 5),
(4, 'Montreal - 307 Queen St', 2, 'hotel5@forest.com', '613-000-4005', 5),
(4, 'Montreal - 308 Queen St', 1, 'hotel6@forest.com', '613-000-4006', 5),
(4, 'Quebec - 404 Rue St', 3, 'hotel7@forest.com', '613-000-4007', 5),
(4, 'Vancouver - 504 Ocean Dr', 4, 'hotel8@forest.com', '613-000-4008', 5),

-- Urban Sleepers
(5, 'Downtown Ottawa - 109 Main St', 3, 'hotel1@urban.com', '613-000-5001', 5),
(5, 'Downtown Ottawa - 110 Main St', 4, 'hotel2@urban.com', '613-000-5002', 5),
(5, 'Toronto - 209 King St', 5, 'hotel3@urban.com', '613-000-5003', 5),
(5, 'Toronto - 210 King St', 3, 'hotel4@urban.com', '613-000-5004', 5),
(5, 'Montreal - 309 Queen St', 2, 'hotel5@urban.com', '613-000-5005', 5),
(5, 'Montreal - 310 Queen St', 1, 'hotel6@urban.com', '613-000-5006', 5),
(5, 'Quebec - 405 Rue St', 3, 'hotel7@urban.com', '613-000-5007', 5),
(5, 'Vancouver - 505 Ocean Dr', 4, 'hotel8@urban.com', '613-000-5008', 5);
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
-- Guests
INSERT INTO guest (full_name, address, social_security_number, checkin_date) VALUES
('John Doe', '123 Main St', '999-999-999', CURRENT_DATE),
('Jane Smith', '124 Main St', '888-888-888', CURRENT_DATE),
('Mike Jordan', '125 Main St', '777-777-777', CURRENT_DATE),
('Sara Connor', '126 Main St', '666-666-666', NULL),
('Tom Riddle', '127 Main St', '555-555-555', NULL);
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
-- Rooms for Hotel 1
INSERT INTO room (hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages) VALUES
(1, 100.00, 1, 20, false, false, true, NULL),
(1, 120.00, 2, 25, true, false, false, NULL),
(1, 140.00, 3, 30, false, true, true, 'Broken lamp'),
(1, 160.00, 4, 35, false, false, true, NULL),
(1, 180.00, 5, 40, true, true, false, NULL);

-- Rooms for Hotel 2
INSERT INTO room (hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages) VALUES
(2, 90.00, 1, 18, false, false, false, NULL),
(2, 110.00, 2, 22, true, false, false, NULL),
(2, 130.00, 3, 26, false, true, true, NULL),
(2, 150.00, 4, 30, false, false, false, 'Stained carpet'),
(2, 170.00, 5, 34, true, true, true, NULL),

-- Rooms for Hotel 3
INSERT INTO room (hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages) VALUES
(3, 95.00, 1, 21, false, false, true, NULL),
(3, 115.00, 2, 24, true, true, false, NULL),
(3, 135.00, 3, 28, false, false, true, 'Cracked mirror'),
(3, 155.00, 4, 32, false, true, false, NULL),
(3, 175.00, 5, 36, true, false, true, NULL);

-- Rooms for Hotel 4
INSERT INTO room (hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages) VALUES
(4, 105.00, 1, 19, false, true, false, NULL),
(4, 125.00, 2, 23, true, false, true, NULL),
(4, 145.00, 3, 27, false, false, false, 'Leaky faucet'),
(4, 165.00, 4, 31, true, true, true, NULL),
(4, 185.00, 5, 35, false, false, true, NULL);

-- Rooms for Hotel 5
INSERT INTO room (hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages) VALUES
(5, 110.00, 1, 22, true, false, true, NULL),
(5, 130.00, 2, 26, false, true, false, NULL),
(5, 150.00, 3, 30, true, true, true, 'Damaged curtains'),
(5, 170.00, 4, 34, false, false, false, NULL),
(5, 190.00, 5, 38, true, false, true, NULL);
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
-- Employees for Hotel 1
INSERT INTO employee (hotel_id, full_name, address, social_security_number, role) VALUES
(1, 'Alice Johnson', '10 Manager Rd', '100-100-100', 'manager'),
(1, 'Bob Lee', '20 Staff Rd', '200-100-200', 'staff'),
(1, 'Chris Park', '21 Staff Rd', '200-100-201', 'staff'),
(1, 'Emma Garcia', '22 Staff Rd', '200-100-202', 'staff');

-- Employees for Hotel 2
INSERT INTO employee (hotel_id, full_name, address, social_security_number, role) VALUES
(2, 'Clara Zhang', '12 Manager Blvd', '300-100-300', 'manager'),
(2, 'David Kim', '23 Staff Blvd', '400-100-400', 'staff'),
(2, 'Isla White', '24 Staff Blvd', '400-100-401', 'staff'),
(2, 'Jason Lee', '25 Staff Blvd', '400-100-402', 'staff');

-- Employees for Hotel 3
INSERT INTO employee (hotel_id, full_name, address, social_security_number, role) VALUES
(3, 'Charlie Evans', '13 Manager Ave', '300-300-300', 'manager'),
(3, 'Dana Brooks', '26 Staff Ave', '400-300-400', 'staff'),
(3, 'Kevin Stone', '27 Staff Ave', '400-300-401', 'staff'),
(3, 'Tina Bell', '28 Staff Ave', '400-300-402', 'staff');

-- Employees for Hotel 4
INSERT INTO employee (hotel_id, full_name, address, social_security_number, role) VALUES
(4, 'Eli Thompson', '14 Manager Cir', '300-400-300', 'manager'),
(4, 'Fay Miller', '29 Staff Cir', '400-400-400', 'staff'),
(4, 'Noah Carter', '30 Staff Cir', '400-400-401', 'staff'),
(4, 'Lily Adams', '31 Staff Cir', '400-400-402', 'staff');

-- Employees for Hotel 5
INSERT INTO employee (hotel_id, full_name, address, social_security_number, role) VALUES
(5, 'Grace Nelson', '15 Manager Way', '300-500-300', 'manager'),
(5, 'Henry Scott', '32 Staff Way', '400-500-400', 'staff'),
(5, 'Olivia Hayes', '33 Staff Way', '400-500-401', 'staff'),
(5, 'James Moore', '34 Staff Way', '400-500-402', 'staff');
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
-- Reservation & Rental for testing
INSERT INTO reservation (start_date, end_date, status, guest_id, room_id) VALUES
(CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 'booked', 1, 1);

INSERT INTO rental (reservation_id, guest_id, employee_id, start_date, end_date, payment_status, room_id) VALUES
(1, 1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', TRUE, 1);
--------------------------------------------------------------------------------------------------------