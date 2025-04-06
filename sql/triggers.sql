-- Trigger 1: Prevent invalid reservation dates
-- This trigger blocks any reservation where end_date is NOT after start_date

-- Step 1: Create the function that checks the dates
CREATE OR REPLACE FUNCTION validate_reservation_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date <= NEW.start_date THEN
    RAISE EXCEPTION 'Reservation end_date must be after start_date.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Bind the function to the reservation table
CREATE TRIGGER trg_validate_reservation_dates
BEFORE INSERT OR UPDATE ON reservation
FOR EACH ROW
EXECUTE FUNCTION validate_reservation_dates();

----------------------------------------------------------------------------------------------

-- Trigger 2: Archive rooms before deletion
-- When a room is deleted, this trigger saves it into a RoomArchive table

-- Step 1: Create the archive table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS RoomArchive (
  archived_room_id SERIAL PRIMARY KEY,
  room_id INT,
  hotel_id INT,
  price DECIMAL,
  capacity INT,
  area INT,
  sea_view BOOLEAN,
  mountain_view BOOLEAN,
  extendable BOOLEAN,
  damages TEXT,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create function to copy room data into archive
CREATE OR REPLACE FUNCTION archive_deleted_room()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO RoomArchive (room_id, hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages)
  VALUES (
    OLD.room_id, OLD.hotel_id, OLD.price, OLD.capacity, OLD.area,
    OLD.sea_view, OLD.mountain_view, OLD.extendable, OLD.damages
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Bind the function to the room table
CREATE TRIGGER trg_archive_deleted_room
BEFORE DELETE ON room
FOR EACH ROW
EXECUTE FUNCTION archive_deleted_room();

----------------------------------------------------------------------------------------------

-- Trigger 3: Auto-archive a reservation when it turns into a rental
-- When a reservation becomes a rental (i.e., when it's booked → rented), the reservation 
-- row should be archived so that it doesn't get booked again or shown as active.

-- Step 1: Create archive table for reservations
CREATE TABLE IF NOT EXISTS ReservationArchive (
  archived_reservation_id SERIAL PRIMARY KEY,
  reservation_id INT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20),
  guest_id INT,
  room_id INT,
  archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Archive reservation when it's deleted
CREATE OR REPLACE FUNCTION archive_deleted_reservation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ReservationArchive (reservation_id, start_date, end_date, status, guest_id, room_id)
  VALUES (
    OLD.reservation_id, OLD.start_date, OLD.end_date,
    OLD.status, OLD.guest_id, OLD.room_id
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Trigger on reservation delete
CREATE TRIGGER trg_archive_deleted_reservation
BEFORE DELETE ON reservation
FOR EACH ROW
EXECUTE FUNCTION archive_deleted_reservation();

----------------------------------------------------------------------------------------------

-- Trigger 4: Ensure each hotel has only one manager
-- Enforce that only one manager per hotel is allowed.

CREATE OR REPLACE FUNCTION enforce_one_manager_per_hotel()
RETURNS TRIGGER AS $$
DECLARE
  mgr_count INT;
BEGIN
  SELECT COUNT(*) INTO mgr_count
  FROM employee
  WHERE hotel_id = NEW.hotel_id AND role = 'manager';

  IF (NEW.role = 'manager' AND mgr_count >= 1) THEN
    RAISE EXCEPTION 'Each hotel can have only one manager.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_one_manager_per_hotel
BEFORE INSERT OR UPDATE ON employee
FOR EACH ROW
EXECUTE FUNCTION enforce_one_manager_per_hotel();

----------------------------------------------------------------------------------------------

-- Trigger 5: Auto-delete reservation when it becomes a rental

CREATE OR REPLACE FUNCTION remove_reservation_after_rental()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reservation_id IS NOT NULL THEN
    DELETE FROM reservation WHERE reservation_id = NEW.reservation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_reservation_after_rental
AFTER INSERT ON rental
FOR EACH ROW
EXECUTE FUNCTION remove_reservation_after_rental();

----------------------------------------------------------------------------------------------

-- Trigger 6: Enforce positive room price
-- Constraint: price must be ≥ 0 (Enforce positive price)

CREATE OR REPLACE FUNCTION enforce_positive_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.price < 0 THEN
    RAISE EXCEPTION 'Room price must be positive.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_positive_price
BEFORE INSERT OR UPDATE ON room
FOR EACH ROW
EXECUTE FUNCTION enforce_positive_price();

