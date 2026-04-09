import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const setToken = useAuthStore(s => s.setToken);
  const setUser  = useAuthStore(s => s.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token); setUser(data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  const FIELD_STYLE: React.CSSProperties = {
    width: '100%', height: '2.625rem', borderRadius: '0.625rem',
    border: '1.5px solid hsl(220,13%,88%)', background: 'hsl(220,25%,98.5%)',
    padding: '0 0.875rem 0 2.625rem', fontSize: '0.9rem',
    outline: 'none', color: 'hsl(224,71%,8%)', fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif',
      background: 'hsl(220,25%,97%)',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.07), transparent), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(139,92,246,0.05), transparent)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: 'hsl(224,71%,4%)',
        padding: '3rem',
      }} className="hidden md:flex">
        <div style={{ maxWidth: 380, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}>
            <Shield size={30} color="#fff" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>Smart Compliance Tracking</h1>
          <p style={{ color: 'hsl(215,20%,50%)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Enterprise-grade deviation tracking, CAPA management, and audit workflows — all in one place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2.5rem', textAlign: 'left' }}>
            {['Real-time compliance monitoring', 'Role-based access control', 'Audit trail & activity logs', 'Automated CAPA workflows'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'hsl(215,20%,55%)', fontSize: '0.875rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo for small screens */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
              <Shield size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'hsl(224,71%,8%)' }}>ComplianceHub</span>
          </div>

          <h2 style={{ margin: '0 0 0.375rem', fontSize: '1.5rem', fontWeight: 800, color: 'hsl(224,71%,8%)', letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ margin: '0 0 2rem', fontSize: '0.875rem', color: 'hsl(215,16%,50%)' }}>Sign in to your compliance dashboard.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'hsl(224,71%,12%)', marginBottom: '0.375rem' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215,16%,55%)' }} />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={FIELD_STYLE}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'hsl(220,13%,88%)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'hsl(220,25%,98.5%)'; }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'hsl(224,71%,12%)', marginBottom: '0.375rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(215,16%,55%)' }} />
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={FIELD_STYLE}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'hsl(220,13%,88%)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'hsl(220,25%,98.5%)'; }}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.8125rem', color: '#dc2626', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              height: '2.75rem', borderRadius: '0.625rem',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
              transition: 'opacity 0.15s, transform 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'none')}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign in</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'hsl(215,16%,50%)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.textDecoration = 'underline')}
              onMouseLeave={e => ((e.target as HTMLElement).style.textDecoration = 'none')}>
              Create account
            </Link>
          </p>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff', border: '1px solid hsl(220,13%,90%)', borderRadius: '0.75rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'hsl(215,16%,45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Credentials</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { role: 'Admin', email: 'admin@compliance.com' },
                { role: 'Manager', email: 'manager@compliance.com' },
                { role: 'Auditor', email: 'auditor@compliance.com' },
              ].map(c => (
                <div key={c.role} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'hsl(215,16%,50%)', fontWeight: 500 }}>{c.role}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#6366f1', cursor: 'pointer' }}
                    onClick={() => { setEmail(c.email); setPassword('password123'); }}>
                    {c.email}
                  </span>
                </div>
              ))}
              <p style={{ margin: '0.375rem 0 0', fontSize: '0.7rem', color: 'hsl(215,16%,55%)' }}>Password: <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>password123</code> (click to autofill)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
