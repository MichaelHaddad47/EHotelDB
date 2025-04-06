-- Query 1: Available rooms in a hotel during a date range
-- Shows rooms in hotel_id = 1 that are NOT reserved or rented during the next 3 days
SELECT r.*
FROM room r
WHERE r.hotel_id = 1
  AND r.room_id NOT IN (
    SELECT room_id FROM reservation
    WHERE (start_date, end_date) OVERLAPS (CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days')
  )
  AND r.room_id NOT IN (
    SELECT room_id FROM rental
    WHERE (start_date, end_date) OVERLAPS (CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days')
  );

-- Query 2: Guests with active or upcoming reservations
-- Lists all guests with current or future reservations
SELECT g.full_name, g.social_security_number, r.start_date, r.end_date
FROM guest g
JOIN reservation r ON g.guest_id = r.guest_id
WHERE r.end_date >= CURRENT_DATE;

-- Query 3: Number of available rooms per hotel zone
-- Groups rooms by city zone and shows how many are available in the next 7 days
SELECT
  SUBSTRING(h.address FROM '^[^-]+') AS zone,
  COUNT(*) AS available_rooms
FROM hotel h
JOIN room r ON h.hotel_id = r.hotel_id
WHERE r.room_id NOT IN (
  SELECT room_id FROM reservation
  WHERE (start_date, end_date) OVERLAPS (CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days')
)
GROUP BY zone
ORDER BY available_rooms DESC;

-- Query 4: Top employees by rentals processed
-- Shows the top 5 employees who handled the most rentals
SELECT e.full_name, COUNT(r.rental_id) AS rentals_handled
FROM employee e
JOIN rental r ON e.employee_id = r.employee_id
GROUP BY e.employee_id
ORDER BY rentals_handled DESC
LIMIT 5;
