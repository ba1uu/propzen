import { useState } from 'react';

export default function ProfilePage({ user, onProfileSaved }) {
  const [form, setForm] = useState({
    phone: '', age: '', occupation: '', income: '',
    city: 'Hyderabad', purpose: 'buy'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setError('');
    if (!form.phone || !form.age || !form.occupation) return setError('Please fill all required fields.');
    setLoading(true);
    try {
      const res = await fetch('https://propzen-2.onrender.com/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email: user.email })
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); setLoading(false); return; }
      onProfileSaved({ ...user, profile: form });
    } catch {
      setError('Cannot connect to server.');
    }
    setLoading(false);
  };

  const cities = ['Hyderabad','Bangalore','Mumbai','Delhi','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Surat'];
  const occupations = ['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Student', 'Retired', 'Other'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">Step 2 of 6</div>
        <h1 className="page-title">Build Your Profile</h1>
        <p className="page-sub">We personalise predictions and EMI advice based on your details</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">{user.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div className="avatar-name">{user.name}</div>
            <div className="avatar-email">{user.email}</div>
          </div>
        </div>

        <div className="two-col">
          <div className="field-group">
            <label>📱 Phone Number <span className="req">*</span></label>
            <input className="field-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="field-group">
            <label>🎂 Age <span className="req">*</span></label>
            <input className="field-input" type="number" placeholder="28" min="18" max="80" value={form.age} onChange={e => set('age', e.target.value)} />
          </div>
        </div>

        <div className="two-col">
          <div className="field-group">
            <label>💼 Occupation <span className="req">*</span></label>
            <select className="field-input" value={form.occupation} onChange={e => set('occupation', e.target.value)}>
              <option value="">Select...</option>
              {occupations.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label>💰 Annual Income (₹)</label>
            <input className="field-input" type="number" placeholder="800000" value={form.income} onChange={e => set('income', e.target.value)} />
          </div>
        </div>

        <div className="two-col">
          <div className="field-group">
            <label>🏙️ Preferred City</label>
            <select className="field-input" value={form.city} onChange={e => set('city', e.target.value)}>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label>🎯 Purpose of Buying</label>
            <select className="field-input" value={form.purpose} onChange={e => set('purpose', e.target.value)}>
              <option value="buy">Self Use</option>
              <option value="invest">Investment</option>
              <option value="rent">Rental Income</option>
              <option value="vacation">Vacation Home</option>
            </select>
          </div>
        </div>

        {error && <div className="error-msg">⚠ {error}</div>}

        <button className="primary-btn full-btn" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save & Continue →'}
        </button>
      </div>
    </div>
  );
}