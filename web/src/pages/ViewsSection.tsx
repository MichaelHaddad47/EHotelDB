import { useState } from 'react';

export default function ViewsSection() {
  const [hotelId, setHotelId] = useState('');
  const [roomStats] = useState([
    { room_id: 101, hotel_id: 1, type: 'Single', capacity: 1 },
    { room_id: 102, hotel_id: 1, type: 'Double', capacity: 2 },
    { room_id: 201, hotel_id: 2, type: 'Family', capacity: 4 },
    { room_id: 103, hotel_id: 3, type: 'Single', capacity: 1 },
  ]);

  const [areaStats] = useState([
    { area: 'Ottawa', rooms: 23 },
    { area: 'Toronto', rooms: 17 },
    { area: 'Montreal', rooms: 10 },
  ]);

  const filtered = hotelId
    ? roomStats.filter((r) => r.hotel_id === parseInt(hotelId))
    : roomStats;

  return (
    <div className="text-white space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Available Rooms by Area</h2>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {areaStats.map((area) => (
            <div key={area.area} className="bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm">
                <strong>Area:</strong> {area.area}
              </p>
              <p className="text-sm">
                <strong>Rooms:</strong> {area.rooms}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Room Capacity by Hotel</h2>
        <input
          type="text"
          placeholder="Enter Hotel ID"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          className="mb-4 p-2 bg-slate-900 rounded w-full md:w-64"
        />

        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((room) => (
            <div key={room.room_id} className="bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm">
                <strong>Room #{room.room_id}</strong>
              </p>
              <p className="text-sm">{room.type} — Capacity: {room.capacity}</p>
              <p className="text-sm">Hotel ID: {room.hotel_id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
