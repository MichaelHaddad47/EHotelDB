export interface Booking {
    reservation_id: number;
    guest_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    status?: string;
  }
  
  export async function getAllReservations(): Promise<Booking[]> {
    try {
      const res = await fetch('http://localhost:5000/reservations');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
      const data = await res.json();
      return data.map((item: any) => ({
        reservation_id: item.reservation_id,
        guest_id: item.guest_id,
        room_id: item.room_id,
        start_date: item.start_date,
        end_date: item.end_date,
        status: item.status
      }));
    } catch (err) {
      console.error('Error fetching reservations:', err);
      return [];
    }
  }
  
  export async function createReservation(data: {
    guest_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
  }) {
    const res = await fetch('http://localhost:5000/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      let msg = 'Reservation failed';
      try {
        const err = await res.json();
        msg = err.error || msg;
      } catch (_) {}
      throw new Error(msg);
    }
  
    return await res.json();
  }