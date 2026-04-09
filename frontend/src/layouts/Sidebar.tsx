import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, AlertCircle, FileText, CheckSquare, ClipboardList, LogOut, Shield, ChevronRight } from "lucide-react";
import useAuthStore from "@/store/authStore";

const navItems = [
  { name: "Dashboard",  href: "/",            icon: LayoutDashboard,  label: "Overview" },
  { name: "SOPs",       href: "/sops",         icon: FileText,          label: "Documents" },
  { name: "Deviations", href: "/deviations",  icon: AlertCircle,       label: "Issues" },
  { name: "CAPAs",      href: "/capas",        icon: CheckSquare,       label: "Actions" },
  { name: "Audits",     href: "/audits",       icon: ClipboardList,     label: "Reviews" },
];

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN: "Admin",
    COMPLIANCE_MANAGER: "Manager",
    PROCESS_OWNER: "Owner",
    AUDITOR: "Auditor",
    EMPLOYEE: "Employee",
  };
  return (
    <span style={{
      fontSize: '0.65rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '0.1rem 0.45rem',
      borderRadius: '9999px',
      background: 'rgba(99,102,241,0.2)',
      color: '#a5b4fc',
      border: '1px solid rgba(99,102,241,0.3)',
    }}>
      {map[role] ?? role}
    </span>
  );
}

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" style={{ width: '220px', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{
        padding: '1.25rem 1rem',
        borderBottom: '1px solid hsl(217,19%,11%)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
      }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: '0.5rem',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(99,102,241,0.5)',
          flexShrink: 0,
        }}>
          <Shield size={16} color="#fff" />
        </div>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '-0.01em' }}>ComplianceHub</div>
          <div style={{ color: 'hsl(215,20%,40%)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Smart Tracking</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.125rem', overflowY: 'auto' }}>
        <div style={{ color: 'hsl(215,20%,38%)', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 0.75rem 0.25rem', marginBottom: '0.25rem' }}>
          Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={15} />
            <span style={{ flex: 1 }}>{item.name}</span>
            <ChevronRight size={12} style={{ opacity: 0.3 }} />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid hsl(217,19%,11%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.75rem',
            flexShrink: 0,
          }}>
            {(user?.name ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#e2e8f0', fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name ?? 'User'}</div>
            <RoleBadge role={user?.role ?? 'EMPLOYEE'} />
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.5rem',
            borderRadius: '0.375rem',
            color: 'hsl(215,20%,45%)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(215,20%,45%)'; }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
