import { useState } from 'react';
import LoginModal from './LoginModal'; // Make sure path is correct

export default function Navbar() {
  const [modalRole, setModalRole] = useState<'admin' | 'employee' | null>(null);

  const handleSuccess = (role: 'admin' | 'employee') => {
    console.log(`Logged in as ${role}`);
    // Save to global state or redirect later if needed
  };

  return (
    <nav className="bg-[#1f2937] text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">E-Hotel System</h1>
      <div className="space-x-4">
        <button
          className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
          onClick={() => setModalRole('employee')}
        >
          Employee Login
        </button>
        <button
          className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
          onClick={() => setModalRole('admin')}
        >
          Admin Login
        </button>
      </div>

      {modalRole && (
        <LoginModal
          role={modalRole}
          onClose={() => setModalRole(null)}
          onSuccess={handleSuccess}
        />
      )}
    </nav>
  );
}
