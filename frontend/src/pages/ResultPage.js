import { useEffect, useState } from 'react';

export default function ResultPage({ user, location, details, onNext }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://propzen.onrender.com/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details)
        });
        const data = await res.json();
        if (!data.success) { setError(data.error); setLoading(false); return; }
        setResult(data);
        setLoading(false);
        // Animate counter
        let start = 0;
        const end = data.price_lakhs;
        const step = end / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 20);
        return () => clearInterval(timer);
      } catch {
        setError('Cannot connect to server.');
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="page-container center-content">
      <div className="loader-ring" />
      <p className="loading-text">Analysing 8,000 Indian properties…</p>
    </div>
  );

  if (error) return (
    <div className="page-container center-content">
      <div className="error-big">⚠ {error}</div>
    </div>
  );

  const { formatted_price, price_lakhs, price_per_sqft } = result;
  const cat = price_lakhs < 40 ? {l:'Budget',c:'#22C55E'} :
              price_lakhs < 80 ? {l:'Mid Segment',c:'#F59E0B'} :
              price_lakhs < 150 ? {l:'Premium',c:'#D4A017'} : {l:'Luxury',c:'#EF4444'};

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">Step 5 of 6</div>
        <h1 className="page-title">Price Prediction</h1>
        <p className="page-sub">{location.city} · {details.areaSqft} sq.ft · {details.bhk} BHK</p>
      </div>

      <div className="result-hero">
        <div className="result-glow" />
        <div className="result-label-top">Estimated Market Value</div>
        <div className="result-big-price">{formatted_price}</div>
        <div className="result-counter">₹{count.toFixed(1)} Lakhs</div>
        <div className="result-cat" style={{background: cat.c + '22', color: cat.c, border: `1px solid ${cat.c}55`}}>
          {cat.l} Property
        </div>
      </div>

      <div className="result-metrics">
        <div className="metric-card">
          <div className="metric-icon">📐</div>
          <div className="metric-val">₹{price_per_sqft?.toLocaleString('en-IN')}</div>
          <div className="metric-label">per sq.ft</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🏙️</div>
          <div className="metric-val">{location.city}</div>
          <div className="metric-label">Location</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🏠</div>
          <div className="metric-val">{details.bhk} BHK</div>
          <div className="metric-label">{details.bathrooms} Bath</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-val">{details.yearBuilt}</div>
          <div className="metric-label">Year Built</div>
        </div>
      </div>

      <div className="total-row">
        <div className="total-item">
          <span>Total (₹)</span>
          <strong>₹{(price_lakhs * 100000).toLocaleString('en-IN')}</strong>
        </div>
        <div className="total-item">
          <span>In Lakhs</span>
          <strong>₹{price_lakhs.toFixed(1)}L</strong>
        </div>
        <div className="total-item">
          <span>In Crores</span>
          <strong>{price_lakhs >= 100 ? `₹${(price_lakhs/100).toFixed(2)}Cr` : '—'}</strong>
        </div>
        <div className="total-item">
          <span>Stamp Duty ~6%</span>
          <strong>₹{(price_lakhs * 0.06).toFixed(1)}L</strong>
        </div>
      </div>

      <button className="primary-btn full-btn" onClick={() => onNext(result)}>
        View Suggestions & Advice →
      </button>
    </div>
  );
}