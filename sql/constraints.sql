-- 1 & 2: Social Security Numbers must be unique (already enforced by schema)
-- Already handled in `seed.sql` via UNIQUE constraint on `social_security_number`

-- 3 & 4: One manager per hotel, manager only manages one hotel
-- Enforce via role logic — no additional SQL constraints required if you enforce it in frontend/backend

-- 6: Hotel must belong to hotel chain (already enforced via foreign key)
-- 5: Room must belong to hotel (already enforced via foreign key)

-- 10: Room price must be >= 0 (already done in schema with CHECK)

-- 11: Star rating should be between 1 and 5 (already done in schema)

-- 12: Enforce reservation dates (also already handled via trigger)

-- Extra: Prevent duplicate bookings (not yet implemented)
CREATE OR REPLACE FUNCTION prevent_overlapping_rentals()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM rental
    WHERE room_id = NEW.room_id
      AND daterange(NEW.start_date, NEW.end_date, '[]') &&
          daterange(start_date, end_date, '[]')
  ) THEN
    RAISE EXCEPTION 'This room is already rented during that time.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_overlapping_rentals
BEFORE INSERT ON rental
FOR EACH ROW
EXECUTE FUNCTION prevent_overlapping_rentals();
