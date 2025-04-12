import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Matchups', path: '/matchups', icon: <Users size={18} /> },
    { label: 'Side Bets', path: '/sidebets', icon: <Trophy size={18} /> },
    { label: 'My Bets', path: '/mybets', icon: <Crown size={18} /> },
    { label: 'League Data', path: '/leaguedata', icon: <ClipboardList size={18} /> },
    { label: 'Collections', path: '/collections', icon: <DollarSign size={18} /> },
  ];

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

      {/* Footer / Profile with CircleUser and Settings icon */}
      <div className="flex items-center justify-between border-t border-gray-600 pt-4 mt-6">
        <div className="flex items-center space-x-2">
          <CircleUser size={22} />
          <span className="text-sm font-semibold">
            {user?.display_name || 'Profile'}
          </span>
        </div>
        <Settings size={18} className="cursor-pointer hover:text-teal-300 transition" />
      </div>
    </div>
  );
}