// src/data/roomData.ts
export interface Room {
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
  
  // ✅ Fetch all rooms from DB
 export async function getRooms(): Promise<Room[]> {
  const res = await fetch('http://localhost:5000/rooms/all'); // changed /rooms → /rooms/all
  return await res.json();
}
  
  // ✅ Update damage on DB
  export async function updateRoomDamage(roomId: number, damage: string | null): Promise<void> {
    const res = await fetch(`http://localhost:5000/rooms/${roomId}/damage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ damage })  // This is what your backend expects
    });
  
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to update damage: ${error}`);
    }
  }
  