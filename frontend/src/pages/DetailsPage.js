import { useState } from 'react';

export default function DetailsPage({ user, location, onDetailsSubmit }) {
  const [form, setForm] = useState({
    areaSqft: 1000, bhk: 2, bathrooms: 2,
    yearBuilt: 2015, floor: 3, locationRating: 3,
    parking: 1, lift: 1, furnished: 1,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const Toggle = ({ label, field, options }) => (
    <div className="field-group">
      <label>{label}</label>
      <div className="toggle-row">
        {options.map(o => (
          <button
            key={o.value}
            className={`toggle-btn ${form[field] === o.value ? 'active' : ''}`}
            onClick={() => set(field, o.value)}
          >{o.label}</button>
        ))}
      </div>
    </div>
  );

  const stars = [1,2,3,4,5];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">Step 4 of 6</div>
        <h1 className="page-title">House Details</h1>
        <p className="page-sub">Tell us about the property in <strong style={{color:'#D4A017'}}>{location.city}</strong></p>
      </div>

      <div className="details-card">

        {/* Area & BHK */}
        <div className="section-label">📐 Size & Configuration</div>
        <div className="three-col">
          <div className="field-group">
            <label>Area (sq.ft)</label>
            <input className="field-input" type="number" min="200" max="15000"
              value={form.areaSqft} onChange={e => set('areaSqft', +e.target.value)} />
            <span className="field-hint">{form.areaSqft} sq.ft</span>
          </div>
          <div className="field-group">
            <label>BHK</label>
            <div className="num-btns">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`num-btn ${form.bhk === n ? 'active' : ''}`}
                  onClick={() => set('bhk', n)}>{n}</button>
              ))}
            </div>
          </div>
          <div className="field-group">
            <label>Bathrooms</label>
            <div className="num-btns">
              {[1,2,3,4].map(n => (
                <button key={n} className={`num-btn ${form.bathrooms === n ? 'active' : ''}`}
                  onClick={() => set('bathrooms', n)}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Year & Floor */}
        <div className="section-label">🏗️ Property Info</div>
        <div className="two-col">
          <div className="field-group">
            <label>Year Built</label>
            <input className="field-input" type="number" min="1970" max="2024"
              value={form.yearBuilt} onChange={e => set('yearBuilt', +e.target.value)} />
            <span className="field-hint">Age: {2024 - form.yearBuilt} years</span>
          </div>
          <div className="field-group">
            <label>Floor Number</label>
            <input className="field-input" type="number" min="0" max="50"
              value={form.floor} onChange={e => set('floor', +e.target.value)} />
            <span className="field-hint">{form.floor === 0 ? 'Ground floor' : `Floor ${form.floor}`}</span>
          </div>
        </div>

        {/* Location Rating */}
        <div className="section-label">📍 Location Quality</div>
        <div className="field-group">
          <label>Rate the neighbourhood (1 = Remote, 5 = Ultra Prime)</label>
          <div className="star-row">
            {stars.map(s => (
              <button key={s} className={`star-btn ${form.locationRating >= s ? 'lit' : ''}`}
                onClick={() => set('locationRating', s)}>★</button>
            ))}
            <span className="star-label">
              {['','Remote Area','Average Area','Good Location','Prime Area','Ultra Prime'][form.locationRating]}
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="section-label">✨ Amenities</div>
        <Toggle label="🚗 Parking" field="parking" options={[{value:0,label:'No'},{value:1,label:'Yes'}]} />
        <Toggle label="🛗 Lift / Elevator" field="lift" options={[{value:0,label:'No'},{value:1,label:'Yes'}]} />
        <Toggle label="🛋️ Furnished Status" field="furnished"
          options={[{value:0,label:'Unfurnished'},{value:1,label:'Semi-Furnished'},{value:2,label:'Fully Furnished'}]} />

        <button className="primary-btn full-btn"
          onClick={() => onDetailsSubmit({ ...form, latitude: location.lat, longitude: location.lng, income: user.profile?.income, purpose: user.profile?.purpose })}>
          Predict My Price →
        </button>
      </div>
    </div>
  );
}