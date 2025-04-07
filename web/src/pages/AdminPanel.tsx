// src/pages/AdminPanel.tsx
import { useState, useEffect } from 'react';
import EmployeeDashboard from './EmployeeDashboard';
import ViewsSection from './ViewsSection';
import ArchivedSection from './ArchivedSection';

interface Hotel {
  hotel_id: number;
  chain_id: number;
  address: string;
  category: number;
  contact_email: string;
  contact_phone: string;
  total_rooms: number;
}

interface Employee {
  employee_id: number;
  hotel_id: number;
  full_name: string;
  address: string;
  social_security_number: string;
  role: 'Staff';
  email: string;
  password: string;
}

interface Chain {
  chain_id: number;
  name: string;
  headquarters_address: string;
  contact_email: string;
  contact_phone: string;
}

const initialHotels: Hotel[] = [
  {
    hotel_id: 1,
    chain_id: 1,
    address: '123 Main St, Ottawa',
    category: 4,
    contact_email: 'contact@star1.com',
    contact_phone: '613-123-4567',
    total_rooms: 50,
  },
  {
    hotel_id: 2,
    chain_id: 1,
    address: '456 Elm St, Toronto',
    category: 5,
    contact_email: 'info@star2.com',
    contact_phone: '416-987-6543',
    total_rooms: 70,
  },
];

const initialEmployees: Employee[] = [
  {
    employee_id: 1,
    hotel_id: 1,
    full_name: 'Alice Carter',
    address: '789 Pine St, Ottawa',
    social_security_number: '123-45-6789',
    role: 'Staff',
    email: 'alice@hotel.com',
    password: 'alice123',
  },
  {
    employee_id: 2,
    hotel_id: 2,
    full_name: 'Bob Thompson',
    address: '321 Birch Rd, Toronto',
    social_security_number: '987-65-4321',
    role: 'Staff',
    email: 'bob@hotel.com',
    password: 'bob123',
  },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'chains' | 'rooms' | 'employees' | 'views' | 'archived'>('chains');
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);

  const [chainForm, setChainForm] = useState<Chain>({
    chain_id: 0,
    name: '',
    headquarters_address: '',
    contact_email: '',
    contact_phone: '',
  });

  const [employeeForm, setEmployeeForm] = useState<Employee>({
    employee_id: 0,
    hotel_id: 0,
    full_name: '',
    address: '',
    social_security_number: '',
    role: 'Staff',
    email: '',
    password: '',
});

  const [form, setForm] = useState<Hotel>({
    hotel_id: 0,
    chain_id: 1,
    address: '',
    category: 1,
    contact_email: '',
    contact_phone: '',
    total_rooms: 0,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['hotel_id', 'chain_id', 'category', 'total_rooms'].includes(name)
        ? parseInt(value)
        : value,
    }));
  };

  const handleAddHotel = () => {
    if (hotels.some((h) => h.hotel_id === form.hotel_id)) {
      alert('Hotel ID already exists.');
      return;
    }
  
    const fixedForm = { ...form, total_rooms: 5 };
  
    setHotels((prev) => [...prev, fixedForm]);
  
    setForm({
      hotel_id: 0,
      chain_id: 0,
      address: '',
      category: 1,
      contact_email: '',
      contact_phone: '',
      total_rooms: 0, // this doesn't matter since the input is disabled
    });
  };

  const handleRemoveHotel = (id: number) => {
    if (confirm(`Are you sure you want to delete Hotel #${id}?`)) {
      setHotels((prev) => prev.filter((h) => h.hotel_id !== id));
    }
  };

  const handleEmployeeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({
      ...prev,
      [name]: ['employee_id', 'hotel_id'].includes(name) ? parseInt(value) : value,
    }));
  };

  const handleAddEmployee = () => {
    if (employees.some((emp) => emp.employee_id === employeeForm.employee_id)) {
      alert('Employee ID already exists.');
      return;
    }
  
    setEmployees((prev) => [...prev, employeeForm]);
  
    setEmployeeForm({
      employee_id: 0,
      hotel_id: 0,
      full_name: '',
      address: '',
      social_security_number: '',
      role: 'Staff',
      email: '',
      password: '',
    });
  };

  const handleRemoveEmployee = (id: number) => {
    if (confirm(`Are you sure you want to delete Employee #${id}?`)) {
      setEmployees((prev) => prev.filter((e) => e.employee_id !== id));
    }
  };

  const handleAddChain = async () => {
  const { chain_id, name, headquarters_address, contact_email, contact_phone } = chainForm;
  if (!chain_id || !name || !headquarters_address || !contact_email || !contact_phone) {
    return alert("Please fill out all fields");
  }

  const res = await fetch('http://localhost:5000/api/chains', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chainForm),
  });

  if (res.ok) {
    const newChain = await res.json();
    setChains(prev => [...prev, newChain]);
    setChainForm({
      chain_id: 0,
      name: '',
      headquarters_address: '',
      contact_email: '',
      contact_phone: '',
    });
  } else {
    alert("Failed to add chain");
  }
};
  
  const handleDeleteChain = async (id: number) => {
    if (!confirm(`Delete Chain #${id}?`)) return;
    await fetch(`http://localhost:5000/api/chains/${id}`, { method: 'DELETE' });
    setChains(prev => prev.filter(c => c.chain_id !== id));
  };

  useEffect(() => {
    fetch('http://localhost:5000/chains')
      .then(res => res.json())
      .then(data => setChains(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-8">
      <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">Admin Panel</h1>

      <div className="flex justify-center gap-4 mb-6">
        {['chains', 'rooms', 'employees', 'views', 'archived'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600' : 'bg-slate-700'}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'chains' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Manage Hotel Chains</h2>

    {/* Add Chain Form */}
    <div className="bg-slate-800 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
  <input
    type="number"
    placeholder="Chain ID"
    value={chainForm.chain_id}
    onChange={(e) => setChainForm({ ...chainForm, chain_id: +e.target.value })}
    className="p-2 bg-slate-900 rounded"
  />
  <input
    type="text"
    placeholder="Chain Name"
    value={chainForm.name}
    onChange={(e) => setChainForm({ ...chainForm, name: e.target.value })}
    className="p-2 bg-slate-900 rounded"
  />
  <input
    type="text"
    placeholder="Headquarters Address"
    value={chainForm.headquarters_address}
    onChange={(e) => setChainForm({ ...chainForm, headquarters_address: e.target.value })}
    className="p-2 bg-slate-900 rounded"
  />
  <input
    type="email"
    placeholder="Contact Email"
    value={chainForm.contact_email}
    onChange={(e) => setChainForm({ ...chainForm, contact_email: e.target.value })}
    className="p-2 bg-slate-900 rounded"
  />
  <input
    type="text"
    placeholder="Contact Phone"
    value={chainForm.contact_phone}
    onChange={(e) => setChainForm({ ...chainForm, contact_phone: e.target.value })}
    className="p-2 bg-slate-900 rounded"
  />
  <button
  onClick={() => alert("Feature currently unavailable.")}
  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
>
  Add Chain
</button>
</div>


    {/* Chains Table */}
    <h3 className="text-lg font-semibold mb-2">All Hotel Chains</h3>
    <table className="w-full border border-gray-700 text-sm">
    <thead className="bg-slate-800">
  <tr>
    <th className="p-2 border">Chain ID</th>
    <th className="p-2 border">Name</th>
    <th className="p-2 border">Headquarters</th>
    <th className="p-2 border">Email</th>
    <th className="p-2 border">Phone</th>
    <th className="p-2 border">Actions</th>
  </tr>
</thead>
<tbody>
  {chains.map((chain) => (
    <tr key={chain.chain_id} className="bg-slate-900 hover:bg-slate-800">
      <td className="p-2 border">{chain.chain_id}</td>
      <td className="p-2 border">{chain.name}</td>
      <td className="p-2 border">{chain.headquarters_address}</td>
      <td className="p-2 border">{chain.contact_email}</td>
      <td className="p-2 border">{chain.contact_phone}</td>
      <td className="p-2 border">
      <button
  disabled
  title="This action requires upper-level permissions."
  className="bg-gray-600 cursor-not-allowed text-white px-3 py-1 rounded opacity-50 text-center"
>
  Remove
</button>
      </td>
    </tr>
  ))}
</tbody>

    </table>
  </div>
)}


{activeTab === 'rooms' && (
  <EmployeeDashboard hideHeader />
)}

{activeTab === 'employees' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Manage Employees</h2>

    {/* Employee Add Form */}
    <div className="bg-slate-800 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Employee ID</label>
        <input
          name="employee_id"
          type="number"
          value={employeeForm.employee_id}
          onChange={handleEmployeeInput}
          className="p-2 w-full bg-slate-900 rounded"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Hotel ID</label>
        <input
          name="hotel_id"
          type="number"
          value={employeeForm.hotel_id}
          onChange={handleEmployeeInput}
          className="p-2 w-full bg-slate-900 rounded"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
        <input
          name="full_name"
          type="text"
          value={employeeForm.full_name}
          onChange={handleEmployeeInput}
          className="p-2 w-full bg-slate-900 rounded"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Address</label>
        <input
          name="address"
          type="text"
          value={employeeForm.address}
          onChange={handleEmployeeInput}
          className="p-2 w-full bg-slate-900 rounded"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">SSN</label>
        <input
          name="social_security_number"
          type="text"
          pattern="^\d{3}-\d{2}-\d{4}$"
          placeholder="123-45-6789"
          value={employeeForm.social_security_number}
          onChange={handleEmployeeInput}
          className="p-2 w-full bg-slate-900 rounded"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Role</label>
        <input
          disabled
          value="Staff"
          className="p-2 w-full bg-slate-900 rounded text-gray-400 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={employeeForm.email}
          onChange={handleEmployeeInput}
          className="p-2 w-full bg-slate-900 rounded"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <input
          name="password"
          type="password"
          value={employeeForm.password}
          onChange={handleEmployeeInput}
          className="p-2 w-full bg-slate-900 rounded"
        />
      </div>
      <div className="flex items-end">
        <button
          onClick={handleAddEmployee}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white w-full"
        >
          Add Employee
        </button>
      </div>
    </div>

    {/* Employees Table */}
    <h3 className="text-lg font-semibold mb-2">All Employees</h3>
    <table className="w-full border border-gray-700 text-sm">
      <thead className="bg-slate-800">
        <tr>
          <th className="p-2 border">ID</th>
          <th className="p-2 border">Hotel</th>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Address</th>
          <th className="p-2 border">SSN</th>
          <th className="p-2 border">Role</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.employee_id} className="bg-slate-900 hover:bg-slate-800">
            <td className="p-2 border">{emp.employee_id}</td>
            <td className="p-2 border">{emp.hotel_id}</td>
            <td className="p-2 border">{emp.full_name}</td>
            <td className="p-2 border">{emp.address}</td>
            <td className="p-2 border">{emp.social_security_number}</td>
            <td className="p-2 border">{emp.role}</td>
            <td className="p-2 border">{emp.email}</td>
            <td className="p-2 border">
              <button
                onClick={() => handleRemoveEmployee(emp.employee_id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{activeTab === 'views' && <ViewsSection />}

{activeTab === 'archived' && <ArchivedSection />}
    </div>
  );
}
