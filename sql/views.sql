-- View 1: Available rooms by zone (based on hotel address), with date filters
CREATE OR REPLACE VIEW available_rooms_by_zone AS
SELECT
  h.address AS zone,
  COUNT(*) AS available_rooms
FROM room r
JOIN hotel h ON r.hotel_id = h.hotel_id
WHERE r.room_id NOT IN (
  SELECT room_id
  FROM reservation
  WHERE status = 'booked'
    AND daterange(start_date, end_date, '[]') &&
        daterange(CURRENT_DATE::DATE, (CURRENT_DATE + INTERVAL '1 day')::DATE, '[]')
  UNION
  SELECT room_id
  FROM rental
  WHERE daterange(start_date, end_date, '[]') &&
        daterange(CURRENT_DATE::DATE, (CURRENT_DATE + INTERVAL '1 day')::DATE, '[]')
)
GROUP BY h.address;


-- View 2: Capacity of all rooms by hotel
CREATE OR REPLACE VIEW room_capacity_by_hotel AS
SELECT
  h.address AS hotel_address,
  h.hotel_id,
  r.room_id,
  r.capacity
FROM hotel h
JOIN room r ON h.hotel_id = r.hotel_id
ORDER BY h.hotel_id, r.room_id;
