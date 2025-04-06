import { useEffect, useState } from 'react';
import { getRooms, updateRoomDamage, Room } from '../data/roomData';
import { Modal } from '../components/Modal';
import { getAllReservations } from '../data/reservationData';
import { getAllRentals, payRental, createRental } from '../data/rentalData';
import { createReservation } from '../data/reservationData';

interface Booking {
    reservation_id: number;
    guest_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    status?: string;
  }

interface EmployeeDashboardProps {
    hideHeader?: boolean;
}
  
export default function EmployeeDashboard({ hideHeader = false }: EmployeeDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'availability' | 'new' | 'rentals'>('bookings');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [newReservation, setNewReservation] = useState<Booking | null>(null);
  const [rentalPreview, setRentalPreview] = useState<any | null>(null);

  const refreshBookings = async () => {
    try {
      const data = await getAllReservations();
      setBookings(data);
    } catch (err) {
      console.error('Failed to refresh bookings:', err);
    }
  };

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      }
    }
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllReservations();
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await getAllRentals();
        setRentals(data);
      } catch (err) {
        console.error('Failed to fetch rentals:', err);
      }
    };
    fetchRentals();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshBookings();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const isOccupied = (roomId: number) => {
    return bookings.some(booking =>
      booking.room_id === roomId &&
      new Date(booking.start_date) <= new Date() &&
      new Date(booking.end_date) >= new Date()
    );
  };

  const handleReportDamage = async (roomId: number) => {
    const note = prompt('Enter damage note:');
    if (note?.trim()) {
      await updateRoomDamage(roomId, note);
      const updatedRooms = await getRooms();
      setRooms(updatedRooms);
    }
  };
  
  const handleRemoveDamage = async (roomId: number) => {
    await updateRoomDamage(roomId, null);
    const updatedRooms = await getRooms();
    setRooms(updatedRooms);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-8">
      {!hideHeader && (
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">Employee Dashboard</h1>
      )}

      <div className="flex justify-center gap-4 mb-6">
        <button className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setActiveTab('bookings')}>View Bookings</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'availability' ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setActiveTab('availability')}>Room Availability</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'new' ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setActiveTab('new')}>Create Booking</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'rentals' ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setActiveTab('rentals')}>Rentals</button>
      </div>

      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
          <table className="w-full text-left border border-gray-600">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-2 border-b border-gray-700">Reservation ID</th>
                <th className="p-2 border-b border-gray-700">Guest ID</th>
                <th className="p-2 border-b border-gray-700">Room</th>
                <th className="p-2 border-b border-gray-700">From</th>
                <th className="p-2 border-b border-gray-700">To</th>
                <th className="p-2 border-b border-gray-700">Status</th>
                <th className="p-2 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
            {bookings.map((booking: Booking) => {
                const rented = rentals.some(r => r.room_id === booking.room_id && r.start_date === booking.start_date && r.end_date === booking.end_date);
                return (
                  <tr key={booking.reservation_id} className="hover:bg-slate-800">
                    <td className="p-2 border-b border-gray-700">{booking.reservation_id}</td>
                    <td className="p-2 border-b border-gray-700">{booking.guest_id}</td>
                    <td className="p-2 border-b border-gray-700">{booking.room_id}</td>
                    <td className="p-2 border-b border-gray-700">{new Date(booking.start_date).toLocaleDateString()}</td>
                    <td className="p-2 border-b border-gray-700">{new Date(booking.end_date).toLocaleDateString()}</td>
                    <td className="p-2 border-b border-gray-700">{booking.status}</td>
                    <td className="p-2 border-b border-gray-700 text-left">
                      {!rented && (
                        <button
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                          onClick={() => {
                            const room = rooms.find(r => r.room_id === booking.room_id);
                            const nights = Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24));
                            const total = room ? nights * room.price : 0;
                            setRentalPreview({ booking, nights, total, price: room?.price });
                          }}
                        >
                          Rent Room
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'availability' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Room Availability</h2>
          <ul className="space-y-2">
            {rooms.map((room) => {
              const occupied = isOccupied(room.room_id);
              const hasDamage = !!room.damages;

              return (
                <li
                  key={room.room_id}
                  className="p-4 rounded bg-slate-800 border border-gray-700 flex justify-between items-center relative"
                >
                  {/* Status Bar (LEFT) */}
                  <div className={`absolute left-0 top-0 h-full w-1 ${occupied ? 'bg-red-500' : 'bg-green-500'}`} />

                  <div className="flex items-start gap-4 w-full justify-between pl-4">
                    <div>
                      <p className="font-semibold flex items-center gap-3">
                        Room #{room.room_id} — Hotel #{room.hotel_id}
                        <button
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                          onClick={() => setSelectedRoom(room)}
                        >
                          View Details
                        </button>
                      </p>
                      {room.damages && (
                        <p className="text-red-400 italic mt-1">⚠️ {room.damages}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {hasDamage && (
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleRemoveDamage(room.room_id)}
                        >
                          Remove Damage
                        </button>
                      )}
                      <button
                        className={`px-3 py-1 rounded text-sm ${
                          hasDamage
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        }`}
                        disabled={hasDamage}
                        onClick={() => {
                          if (!hasDamage) handleReportDamage(room.room_id);
                        }}
                      >
                        Report Damage
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {activeTab === 'new' && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Create Booking</h2>
          <form
  className="flex flex-col gap-4"
  onSubmit={async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const guest_id = parseInt((form.elements.namedItem("guest_id") as HTMLInputElement).value);
    const room_id = parseInt((form.elements.namedItem("room_id") as HTMLInputElement).value);
    const start_date = (form.elements.namedItem("start_date") as HTMLInputElement).value;
    const end_date = (form.elements.namedItem("end_date") as HTMLInputElement).value;

    if (!guest_id || !room_id || !start_date || !end_date) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const created = await createReservation({ guest_id, room_id, start_date, end_date });
      const updated = await getAllReservations();
      setBookings(updated);
      form.reset();
      setNewReservation(created); // 👉 triggers popup
      setActiveTab('bookings');   // 👉 switch to bookings tab
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes("not available")) {
        alert("❌ That room is unavailable for the selected dates.");
      } else {
        alert("Failed to create reservation.");
      }
      console.error(err);
    }
  }}
>

  <input name="guest_id" type="number" placeholder="Guest ID" className="p-2 rounded bg-slate-800 text-white" />
  <input name="room_id" type="number" placeholder="Room ID" className="p-2 rounded bg-slate-800 text-white" />
  <input name="start_date" type="date" className="p-2 rounded bg-slate-800 text-white" />
  <input name="end_date" type="date" className="p-2 rounded bg-slate-800 text-white" />
  <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
    Confirm Booking
  </button>
</form>
        </div>
      )}

{activeTab === 'rentals' && (
  <div className="text-center mt-16">
    <h2 className="text-3xl font-bold text-yellow-400 mb-4">🚧 Rentals Feature Under Construction</h2>
    <p className="text-gray-300 max-w-xl mx-auto mb-6">
      This section will allow employees to view and manage active rentals, track payments,
      and confirm room assignments from existing reservations.
    </p>

    <div className="bg-slate-800 border border-yellow-500 p-6 rounded-lg inline-block text-left max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-yellow-300 mb-2">💡 How It Will Work</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-200 text-sm">
        <li>Employees will convert <strong>bookings</strong> into <strong>rentals</strong> by confirming room handover.</li>
        <li>Once confirmed, the reservation is marked as <code>completed</code> and added to the rentals list.</li>
        <li>Employees can mark the rental as <strong>paid</strong> when payment is received.</li>
        <li>Rooms with damage can be tracked and updated in the availability tab.</li>
      </ul>
    </div>
  </div>
)}


      {selectedRoom && (
        <Modal onClose={() => setSelectedRoom(null)}>
          <h2 className="text-xl font-bold mb-4 text-blue-300">
            Room #{selectedRoom.room_id} — Hotel #{selectedRoom.hotel_id}
          </h2>
          <ul className="space-y-2 text-white">
            <li>💰 Price: ${selectedRoom.price}/night</li>
            <li>🧍 Capacity: {selectedRoom.capacity}</li>
            <li>📐 Area: {selectedRoom.area} sqm</li>
            <li>🌊 Sea View: {selectedRoom.sea_view ? 'Yes' : 'No'}</li>
            <li>🏔️ Mountain View: {selectedRoom.mountain_view ? 'Yes' : 'No'}</li>
            <li>➕ Extendable: {selectedRoom.extendable ? 'Yes' : 'No'}</li>
            {selectedRoom.damages && (
              <li className="text-red-400">⚠️ Damages: {selectedRoom.damages}</li>
            )}
          </ul>
        </Modal>
      )}

{rentalPreview && (
        <Modal onClose={() => setRentalPreview(null)}>
          <h2 className="text-lg font-bold text-green-400 mb-2">Confirm Rental</h2>
          <p>Guest #{rentalPreview.booking.guest_id}</p>
          <p>Room #{rentalPreview.booking.room_id}</p>
          <p>{rentalPreview.nights} nights × ${rentalPreview.price}/night</p>
          <p className="font-semibold">Total: ${rentalPreview.total}</p>
          <div className="mt-4 text-right">
          <button
  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
  onClick={async () => {
    try {
      await createRental({
        reservation_id: rentalPreview.booking.reservation_id,
        employee_id: 1 // 🔒 required only this
      });
      const updated = await getAllRentals();
      setRentals(updated);
      setRentalPreview(null);
      alert('✅ Rental successfully created.');
    } catch (err) {
      alert("Failed to create rental.");
      console.error(err);
    }
  }}
>
  Confirm Rent
</button>
          </div>
        </Modal>
      )}      

{newReservation && (
  <Modal onClose={() => setNewReservation(null)}>
    <h2 className="text-xl font-bold mb-4 text-green-400">✅ Reservation Created</h2>
    <ul className="space-y-2 text-white">
      <li><strong>Reservation ID:</strong> {newReservation.reservation_id}</li>
      <li><strong>Guest ID:</strong> {newReservation.guest_id}</li>
      <li><strong>Room ID:</strong> {newReservation.room_id}</li>
      <li><strong>From:</strong> {new Date(newReservation.start_date).toLocaleDateString()}</li>
      <li><strong>To:</strong> {new Date(newReservation.end_date).toLocaleDateString()}</li>
      <li><strong>Status:</strong> {newReservation.status}</li>
    </ul>
  </Modal>
)}


    </div>
  );
}
