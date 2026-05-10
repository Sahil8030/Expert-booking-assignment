import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { ToastProvider } from './components/Toast.jsx';
import BookingForm from './pages/BookingForm.jsx';
import ExpertDetail from './pages/ExpertDetail.jsx';
import ExpertList from './pages/ExpertList.jsx';
import MyBookings from './pages/MyBookings.jsx';

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg-primary font-sans">
        <Navbar />
        <main className="mx-auto max-w-[1280px] px-6 pb-16 pt-0">
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/book" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}
