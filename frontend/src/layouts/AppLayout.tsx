import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import useAuthStore from "@/store/authStore";
import { Bell } from "lucide-react";

export function AppLayout() {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'hsl(220,25%,97%)' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header className="topbar" style={{ padding: '0 2rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'hsl(224,71%,8%)' }}>
              {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
            </p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(215,16%,50%)', fontWeight: 400 }}>
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{
              position: 'relative',
              width: 34, height: 34,
              borderRadius: '0.5rem',
              border: '1px solid hsl(220,13%,89%)',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'hsl(215,16%,47%)',
            }}>
              <Bell size={15} />
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 6, height: 6,
                borderRadius: '50%',
                background: '#6366f1',
                border: '1.5px solid #fff',
              }} />
            </button>
            <div style={{
              width: 34, height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.8125rem',
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
              cursor: 'default',
            }}>
              {(user?.name ?? 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
