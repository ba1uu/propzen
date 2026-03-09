import { useState } from 'react';

// ─── PAGE 1: LOGIN / REGISTER ─────────────────────────────────────────────────
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please fill all fields.');
    if (mode === 'register') {
      if (!form.name) return setError('Name is required.');
      if (form.password !== form.confirm) return setError('Passwords do not match.');
    }
    setLoading(true);
    try {
      const res = await fetch(`https://propzen-1.onrender.com/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); setLoading(false); return; }
      onAuth({ email: form.email, name: data.name, hasProfile: data.hasProfile, profile: data.profile });
    } catch {
      setError('Cannot connect to server. Make sure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-grid" />
      <div className="auth-card">
        <div className="auth-logo">⚡ <span>PropZen</span></div>
        <p className="auth-tagline">India's Smartest House Price Predictor</p>

        <div className="tab-row">
          <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
          <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Register</button>
        </div>

        {mode === 'register' && (
          <div className="field-group">
            <label>Full Name</label>
            <input className="field-input" placeholder="Pavan Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
        )}
        <div className="field-group">
          <label>Email Address</label>
          <input className="field-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Password</label>
          <input className="field-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
        </div>
        {mode === 'register' && (
          <div className="field-group">
            <label>Confirm Password</label>
            <input className="field-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
          </div>
        )}

        {error && <div className="error-msg">⚠ {error}</div>}

        <button className="primary-btn full-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
          <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Register here' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}