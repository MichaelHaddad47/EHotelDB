import { useState } from 'react';
import { Modal } from './Modal';
import { createReservation } from '../data/reservationData';


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

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestId, setGuestId] = useState('');

  const handleSubmit = async () => {
    if (!guestId.trim() || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: parseInt(guestId),
          room_id: room.room_id,
          start_date: startDate,
          end_date: endDate,
        }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to book: ${err.error}`);
        return;
      }
  
      const data = await res.json();
      alert(`Booked! Reservation ID: ${data.reservation_id}`);
      setShowModal(false);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="bg-[#111827] border-2 border-blue-500 p-6 rounded-xl shadow-md w-full max-w-xs text-white">
      <h3 className="text-xl font-bold text-blue-400 mb-2">
        Room #{room.room_id} — Hotel #{room.hotel_id}
      </h3>

      <div className="bg-slate-800 p-3 rounded mb-2">
        <p>💰 <strong>Price:</strong> ${room.price}/night</p>
        <p>🧍‍♂️ <strong>Capacity:</strong> {room.capacity}</p>
        <p>📐 <strong>Area:</strong> {room.area} sqm</p>
      </div>

      <div className="bg-slate-800 p-3 rounded mb-2">
        <p>🌊 Sea View: {room.sea_view ? 'Yes' : 'No'}</p>
        <p>🏔️ Mountain View: {room.mountain_view ? 'Yes' : 'No'}</p>
        <p>➕ Extendable: {room.extendable ? 'Yes' : 'No'}</p>
      </div>

      {room.damages && (
        <p className="text-red-400 italic mb-2">⚠️ Damages: {room.damages}</p>
      )}

      <div className="mt-4 flex justify-center">
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Book
        </button>
      </div>

      {showModal && (
  <Modal onClose={() => setShowModal(false)}>
    <h2 className="text-xl font-semibold mb-4">Book This Room</h2>
    <div className="flex flex-col gap-4">
    <label>
  Guest ID:
  <input
    type="number"
    className="w-full p-2 mt-1 rounded bg-slate-700 text-white"
    value={guestId}
    onChange={(e) => setGuestId(e.target.value)}
    placeholder="Enter your Guest ID"
  />
</label>
      <label>
        Start Date:
        <input
          type="date"
          className="w-full p-2 mt-1 rounded bg-slate-700 text-white"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          className="w-full p-2 mt-1 rounded bg-slate-700 text-white"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <button
        onClick={handleSubmit}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        Confirm Booking
      </button>
    </div>
  </Modal>
)}
    </div>
  );
}
