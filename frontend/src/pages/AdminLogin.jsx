import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [state, setState] = useState({ submitting: false, error: null });

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setState({ submitting: true, error: null });
    try {
      await login(form.username, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setState({ submitting: false, error: err.message || 'Login failed.' });
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-center font-display text-3xl font-bold text-teal-900">Admin Login</h1>
      <p className="mt-2 text-center text-sm text-teal-800/70">Manage menu items and orders.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card">
        <div>
          <label className="text-sm font-semibold text-teal-900">Username</label>
          <input
            required
            autoFocus
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-teal-900">Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
          />
        </div>

        {state.error && <p className="text-sm font-medium text-papaya-600">{state.error}</p>}

        <button type="submit" disabled={state.submitting} className="btn-primary w-full">
          {state.submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
