import { useEffect, useState } from 'react';

interface ZoneStat {
  zone: string;
  available_rooms: number;
}

interface CapacityStat {
  hotel_id: number;
  capacity: number;
  count: number;
}

export default function ViewsSection() {
  const [zones, setZones] = useState<ZoneStat[]>([]);
  const [capacities, setCapacities] = useState<CapacityStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zoneRes = await fetch('http://localhost:5000/views/available-rooms');
        const zoneData = await zoneRes.json();

        const capacityRes = await fetch('http://localhost:5000/views/room-capacity');
        const capacityData = await capacityRes.json();

        if (!Array.isArray(zoneData) || !Array.isArray(capacityData)) {
          throw new Error("Invalid data format");
        }

        setZones(zoneData);
        setCapacities(capacityData);
      } catch (err: any) {
        setError(err.message || 'Error loading views');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Available Rooms by Zone</h2>
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-2 border">Zone</th>
              <th className="p-2 border">Available Rooms</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z, idx) => (
              <tr key={idx} className="bg-slate-900 hover:bg-slate-800">
                <td className="p-2 border">{z.zone}</td>
                <td className="p-2 border">{z.available_rooms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-green-400">Room Capacity by Hotel</h2>
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-2 border">Hotel ID</th>
              <th className="p-2 border">Room Capacity</th>
              <th className="p-2 border">Count</th>
            </tr>
          </thead>
          <tbody>
            {capacities.map((c, idx) => (
              <tr key={idx} className="bg-slate-900 hover:bg-slate-800">
                <td className="p-2 border">{c.hotel_id}</td>
                <td className="p-2 border">{c.capacity}</td>
                <td className="p-2 border">{c.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
