import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded bg-[#2f81f7]" />
        <span className="font-semibold text-sm">Smart Compliance</span>
      </div>
      <div className="flex-1 mx-6 max-w-xl hidden sm:block">
        <input
          className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
          placeholder="Search SOPs, deviations, users..."
          readOnly
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 truncate max-w-[120px]">
          {user?.name ?? user?.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
