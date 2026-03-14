import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/sop', label: 'SOP Management' },
  { to: '/deviations', label: 'Deviations' },
  { to: '/capa', label: 'CAPA' },
  { to: '/audits', label: 'Audits' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/admin', label: 'Admin Panel' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 border-r border-[#30363d] bg-[#161b22] hidden md:flex flex-col">
      <nav className="flex-1 p-3 space-y-1 text-sm">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? 'bg-[#2f81f7]/20 text-[#2f81f7]' : 'text-gray-300 hover:bg-[#30363d]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
