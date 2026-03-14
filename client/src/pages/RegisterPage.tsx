import React from 'react';
import { useNavigate } from 'react-router-dom';
import { register, RegisterPayload } from '../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState<RegisterPayload>({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    register(form)
      .then(() => navigate('/login', { replace: true }))
      .catch(() => setError('Registration failed'))
      .finally(() => setLoading(false));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2">Create your account</h2>
      <p className="text-xs text-gray-400">Sign up to start tracking deviations and CAPAs.</p>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Name</label>
        <input
          className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Email</label>
        <input
          type="email"
          className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Password</label>
        <input
          type="password"
          className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Department</label>
        <input
          className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
          value={form.department ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, department: e.target.value || undefined }))}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-[#2f81f7] hover:bg-[#1f6fe0] text-sm font-medium py-2 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register user'}
      </button>
    </form>
  );
};

export default RegisterPage;
