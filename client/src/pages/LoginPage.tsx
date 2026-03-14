import React from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    login({ email, password })
      .then((data) => {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => setError('Invalid credentials'))
      .finally(() => setLoading(false));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2">Sign in</h2>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Email</label>
        <input
          type="email"
          className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Password</label>
        <input
          type="password"
          className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-[#2f81f7] hover:bg-[#1f6fe0] text-sm font-medium py-2 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

export default LoginPage;
