import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoomBooking from './pages/RoomBooking';
import EmployeeDashBoard from './pages/EmployeeDashboard';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guest/book" element={<RoomBooking />} />
        <Route path="/employee/manage" element={<EmployeeDashBoard />} />
        <Route path="/admin/manage" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
