import { useState } from 'react';

interface FiltersProps {
  onChange: (filters: Record<string, string>) => void;
}

export default function RoomFilters({ onChange }: FiltersProps) {
    const [filters, setFilters] = useState({
        chain: '',
        hotel: '',
        capacity: '',
        area: '',
        price: '',
        seaView: '',
        mountainView: '',
        extendable: '',
        date: '',
      });
      

  const handleApply = () => {
    onChange(filters);
  };

  const handleReset = () => {
    const cleared = {
      chain: '',
      hotel: '',
      capacity: '',
      area: '',
      price: '',
      seaView: '',
      mountainView: '',
      extendable: '',
      date: '',
    };
    setFilters(cleared);
    onChange(cleared);
  };

  return (
    <div className="bg-[#111827] border border-blue-700 p-6 rounded-lg mt-6 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-white">
        
        <div className="flex flex-col">
          <label>Hotel Chain</label>
          <select
            className="p-2 rounded bg-slate-800 text-white"
            value={filters.chain}
            onChange={(e) => {
              setFilters({ ...filters, chain: e.target.value, hotel: '' });
              // you could also trigger onChange here if needed
            }}
          >
            <option value="">Any</option>
            <option value="1">Star Hotels</option>
            <option value="2">Skyline Group</option>
            <option value="3">Oceanic Inns</option>
            <option value="4">Forest Retreats</option>
            <option value="5">Urban Sleepers</option>
          </select>
        </div>
  
        <div className="flex flex-col">
  <label>Hotel</label>
  <select
    className="p-2 rounded bg-slate-800 text-white"
    value={filters.hotel}
    onChange={(e) => setFilters({ ...filters, hotel: e.target.value })}
  >
    <option value="">Any</option>

    {[...Array(8)].map((_, i) => {
      const base = (parseInt(filters.chain) - 1) * 8;
      const hotelId = base + i + 1;
      return filters.chain
        ? <option key={hotelId} value={hotelId.toString()}>Hotel {hotelId}</option>
        : null;
    })}
  </select>
</div>
  
        <div className="flex flex-col">
          <label>Capacity</label>
          <select
            className="p-2 rounded bg-slate-800 text-white"
            value={filters.capacity}
            onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
          >
            <option value="">Any</option>
            <option value="1">Single (1)</option>
            <option value="2">Double (2)</option>
            <option value="3">Triple (3)</option>
            <option value="4">Family (4)</option>
            <option value="5">Group (5)</option>
          </select>
        </div>
  
        <div className="flex flex-col">
          <label>Min Area (sqm)</label>
          <input
            type="number"
            className="p-2 rounded bg-slate-800 text-white"
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
          />
        </div>
  
        <div className="flex flex-col">
          <label>Max Price ($)</label>
          <input
            type="number"
            className="p-2 rounded bg-slate-800 text-white"
            value={filters.price}
            onChange={(e) => setFilters({ ...filters, price: e.target.value })}
          />
        </div>
  
        <div className="flex flex-col">
          <label>Sea View</label>
          <select
            className="p-2 rounded bg-slate-800 text-white"
            value={filters.seaView}
            onChange={(e) => setFilters({ ...filters, seaView: e.target.value })}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
  
        <div className="flex flex-col">
          <label>Mountain View</label>
          <select
            className="p-2 rounded bg-slate-800 text-white"
            value={filters.mountainView}
            onChange={(e) => setFilters({ ...filters, mountainView: e.target.value })}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
  
        <div className="flex flex-col">
          <label>Extendable</label>
          <select
            className="p-2 rounded bg-slate-800 text-white"
            value={filters.extendable}
            onChange={(e) => setFilters({ ...filters, extendable: e.target.value })}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
  
      <div className="flex justify-center gap-6 mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleApply}
        >
          Apply
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}