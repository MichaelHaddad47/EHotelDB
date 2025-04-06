import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [modalRole, setModalRole] = useState<'employee' | 'admin' | null>(null);

  const handleLoginSuccess = (role: 'employee' | 'admin') => {
    if (role === 'employee') {
      navigate('/employee/manage');
    } else {
      navigate('/admin/manage');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b1120] text-white gap-10">
      <h1 className="text-4xl font-bold text-blue-400 drop-shadow-lg">Welcome to EHotelDB</h1>

      <p className="text-gray-400">Select how you want to enter the system</p>

      <div className="flex gap-6">
        <button
          className="bg-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate('/guest/book')}
        >
          I'm a Guest
        </button>

        <button
          className="bg-green-600 px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          onClick={() => setModalRole('employee')}
        >
          I'm an Employee
        </button>

        <button
          className="bg-gray-700 px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
          onClick={() => setModalRole('admin')}
        >
          Admin Panel
        </button>
      </div>

      {modalRole && (
        <LoginModal
          role={modalRole}
          onClose={() => setModalRole(null)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
