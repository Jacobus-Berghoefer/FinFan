import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LinkSleeperModal from './linkSleeperModal';
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Trophy,
  Crown,
  ClipboardList,
  CircleUser,
  Settings,
} from 'lucide-react';

export default function NavBar() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
  
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
  
      toast.success("You’ve been logged out", { id: toastId });
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed", { id: toastId });
    } finally {
      setUser(null); // Always clear context even if request fails
      navigate("/dashboard");
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Matchups', path: '/matchups', icon: <Users size={18} /> },
    { label: 'Side Bets', path: '/sidebets', icon: <Trophy size={18} /> },
    { label: 'My Bets', path: '/mybets', icon: <Crown size={18} /> },
    { label: 'League Data', path: '/leaguedata', icon: <ClipboardList size={18} /> },
    { label: 'Collections', path: '/collections', icon: <DollarSign size={18} /> },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-60 h-screen bg-[#1e1f25] text-white flex flex-col justify-between px-4 py-6 shadow-md">
      {/* Logo / Title */}
      <div className="text-2xl font-bold text-white tracking-wide mb-10">
        Buddy<span className="text-teal-400">Bets</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        {navItems.map(({ label, path, icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-[#2e2f36] transition ${
              location.pathname === path ? 'bg-[#2e2f36]' : ''
            }`}
          >
            {icon}
            <span className="text-sm">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Auth Section */}
      <div className="flex flex-col gap-2 border-t border-gray-600 pt-4 mt-6">
        {user ? (
          <>
            <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/my-profile")}
              className="flex items-center space-x-2 hover:text-teal-300 transition"
            >
              <CircleUser size={22} />
              <span className="text-sm font-semibold">{user.display_name}</span>
            </button>
              <Settings size={18} className="cursor-pointer hover:text-teal-300 transition" />
            </div>

            {!user.sleeper_linked && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-teal-400 hover:underline text-left mt-1"
              >
                Link Sleeper Account
              </button>
            )}

            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:underline text-left mt-1"
            >
              Logout
            </button>

            <LinkSleeperModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </>
        ) : (
          <div className="flex justify-between">
            <Link to="/signup" className="text-sm text-teal-400 hover:underline">
              Signup
            </Link>
            <Link to="/login" className="text-sm text-teal-400 hover:underline">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}