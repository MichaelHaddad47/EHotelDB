import { useState, useEffect } from 'react';
import RoomFilters from '../components/RoomFilters';
import RoomCard from '../components/RoomCard';

interface Room {
  room_id: number;
  hotel_id: number;
  price: number;
  capacity: number;
  area: number;
  sea_view: boolean;
  mountain_view: boolean;
  extendable: boolean;
  damages: string | null;
}

export default function RoomBooking() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // remap frontend filters to backend keys
        const remapped: Record<string, string> = {};
  
        if (filters.hotel) remapped.hotel_id = filters.hotel;
        if (filters.capacity) remapped.capacity = filters.capacity;
        if (filters.area) remapped.area = filters.area;
        if (filters.price) remapped.max_price = filters.price;
        if (filters.seaView) remapped.sea_view = filters.seaView;
        if (filters.mountainView) remapped.mountain_view = filters.mountainView;
        if (filters.extendable) remapped.extendable = filters.extendable;
  
        // Default fake date for now
        remapped.start_date = '2025-04-01';
        remapped.end_date = '2025-04-30';
  
        const query = new URLSearchParams(remapped).toString();
        const res = await fetch(`http://localhost:5000/rooms?${query}`);
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };
    fetchRooms();
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-4 py-10">
      <h1 className="text-3xl text-blue-400 font-bold text-center">Search Available Rooms</h1>
      <RoomFilters onChange={setFilters} />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {rooms.map((room) => (
          <RoomCard key={room.room_id} room={room} />
        ))}
      </div>
    </div>
  );
}
