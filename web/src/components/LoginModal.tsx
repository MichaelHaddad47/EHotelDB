import { useState, useRef } from 'react';

interface LoginModalProps {
  role: 'employee' | 'admin';
  onClose: () => void;
  onSuccess: (role: 'employee' | 'admin') => void;
}

export default function LoginModal({ role, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    if (
      (role === 'employee' && email === 'test@gmail.com' && password === 'test') ||
      (role === 'admin' && email === 'admintest@gmail.com' && password === 'test')
    ) {
      onSuccess(role);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div className="relative bg-[#1f2937] border border-gray-600 p-6 rounded-lg w-full max-w-sm shadow-xl text-white">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-center mb-6">
          {role === 'employee' ? 'Employee Login' : 'Admin Login'}
        </h2>

        <form
  className="flex flex-col gap-4"
  onSubmit={(e) => {
    e.preventDefault(); // Prevent page reload
    handleLogin();      // Call the same login logic
  }}
>
  <input
    type="email"
    placeholder="Email"
    className="p-3 rounded bg-[#2d3748] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    type="password"
    placeholder="Password"
    className="p-3 rounded bg-[#2d3748] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button
    type="submit" // <-- changed to submit
    className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
  >
    Log In
  </button>
</form>
      </div>
    </div>
  );
}
