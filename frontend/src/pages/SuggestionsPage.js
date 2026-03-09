export default function SuggestionsPage({ user, location, details, result, onRestart }) {
  const suggestions = result?.suggestions || [];
  const price_lakhs = result?.price_lakhs || 0;

  const typeColor = { info: '#3B82F6', warning: '#F59E0B', success: '#22C55E' };

  // Compute EMI
  const loanAmt = price_lakhs * 0.8; // 80% loan
  const emi = (loanAmt * 100000 * 0.0085).toFixed(0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">Step 6 of 6</div>
        <h1 className="page-title">Smart Suggestions</h1>
        <p className="page-sub">Personalised advice for <strong style={{color:'#D4A017'}}>{user.name}</strong> based on your prediction</p>
      </div>

      {/* Summary strip */}
      <div className="summary-strip">
        <div className="ss-item">🏠 <span>{location.city}</span></div>
        <div className="ss-item">💰 <span>{result?.formatted_price}</span></div>
        <div className="ss-item">📐 <span>{details?.areaSqft} sq.ft</span></div>
        <div className="ss-item">🛏️ <span>{details?.bhk} BHK</span></div>
      </div>

      {/* EMI Calculator highlight */}
      <div className="emi-banner">
        <div className="emi-left">
          <div className="emi-title">🏦 80% Home Loan EMI Estimate</div>
          <div className="emi-amount">₹{parseInt(emi).toLocaleString('en-IN')}<span>/month</span></div>
          <div className="emi-note">at 8.5% interest rate · 20 year tenure · ₹{loanAmt.toFixed(1)}L loan</div>
        </div>
        <div className="emi-right">
          <div className="emi-stat">
            <span>Down Payment (20%)</span>
            <strong>₹{(price_lakhs * 0.2).toFixed(1)}L</strong>
          </div>
          <div className="emi-stat">
            <span>Loan Amount (80%)</span>
            <strong>₹{loanAmt.toFixed(1)}L</strong>
          </div>
          <div className="emi-stat">
            <span>Total Interest (20yr)</span>
            <strong>₹{(parseInt(emi) * 240 / 100000 - loanAmt).toFixed(1)}L</strong>
          </div>
        </div>
      </div>

      {/* Tip cards */}
      <div className="tips-grid">
        {suggestions.map((tip, i) => (
          <div key={i} className="tip-card" style={{'--tip-color': typeColor[tip.type] || '#D4A017'}}>
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-content">
              <div className="tip-title">{tip.title}</div>
              <div className="tip-text">{tip.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Legal checklist */}
      <div className="checklist-card">
        <h3>📋 Before You Buy — Legal Checklist</h3>
        <div className="checklist-grid">
          {[
            { item: 'RERA Registration', desc: 'Verify at RERA portal' },
            { item: 'Encumbrance Certificate', desc: 'No dues on property' },
            { item: 'Title Deed / Khata', desc: 'Ownership proof' },
            { item: 'Occupancy Certificate', desc: 'Building is legal' },
            { item: 'Property Tax Receipts', desc: 'No pending dues' },
            { item: 'Society NOC', desc: 'For apartment purchase' },
          ].map((c, i) => (
            <div key={i} className="check-item">
              <span className="check-icon">✓</span>
              <div>
                <div className="check-name">{c.item}</div>
                <div className="check-desc">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-row">
        <button className="secondary-btn" onClick={onRestart}>🔄 New Prediction</button>
        <button className="primary-btn" onClick={() => window.print()}>🖨️ Print Report</button>
      </div>
    </div>
  );
}