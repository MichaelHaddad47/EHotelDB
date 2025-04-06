export async function getAllRentals() {
    const res = await fetch('http://localhost:5000/rentals');
    return await res.json();
  }
  
  export async function createRental(data: Partial<{
    reservation_id: number;
    guest_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    employee_id: number;
  }>) {
    const res = await fetch('http://localhost:5000/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  }
  
  export async function payRental(id: number) {
    const res = await fetch(`http://localhost:5000/rentals/${id}/pay`, {
      method: 'PUT',
    });
    return await res.json();
  }