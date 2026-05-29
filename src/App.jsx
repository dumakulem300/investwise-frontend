import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import Subscription from './pages/Subscription';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

function Navbar() {
  const { user, logout, subscription } = useAuth();
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL || user?.email?.endsWith('@investwise.com');

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">InvestWise</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/learning">Learning</Link>
            <Link to="/subscription">Premium</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <span className="text-sm text-gray-300">| {user.email}</span>
            <button onClick={logout} className="bg-red-600 px-2 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}