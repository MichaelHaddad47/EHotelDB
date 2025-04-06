CREATE TABLE HotelChain (
    chain_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    headquarters_address TEXT NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    number_of_hotels INT
);

CREATE TABLE Hotel (
    hotel_id SERIAL PRIMARY KEY,
    chain_id INT REFERENCES HotelChain(chain_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    total_rooms INT NOT NULL
);

CREATE TABLE Room (
    room_id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES Hotel(hotel_id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    area INT,
    sea_view BOOLEAN DEFAULT FALSE,
    mountain_view BOOLEAN DEFAULT FALSE,
    extendable BOOLEAN DEFAULT FALSE,
    damages TEXT DEFAULT NULL,
    amenities TEXT[]
);

CREATE TABLE Guest (
    guest_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    social_security_number VARCHAR(15) UNIQUE NOT NULL,
    checkin_date DATE
);

CREATE TABLE Employee (
    employee_id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES Hotel(hotel_id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    social_security_number VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100) 
);

CREATE TABLE Reservation (
    reservation_id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('booked', 'cancelled', 'completed')),
    guest_id INT REFERENCES Guest(guest_id) ON DELETE CASCADE,
    room_id INT REFERENCES Room(room_id) ON DELETE SET NULL
);

CREATE TABLE Rental (
    rental_id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES Reservation(reservation_id) ON DELETE SET NULL,
    guest_id INT REFERENCES Guest(guest_id) ON DELETE CASCADE,
    employee_id INT REFERENCES Employee(employee_id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    payment_status BOOLEAN DEFAULT FALSE,
    room_id INT REFERENCES Room(room_id) ON DELETE SET NULL
);

CREATE TABLE ArchivedRental (
    rental_id SERIAL PRIMARY KEY,
    reservation_id INT,
    guest_id INT,
    employee_id INT,
    start_date DATE,
    end_date DATE,
    payment_status BOOLEAN,
    room_id INT
);
