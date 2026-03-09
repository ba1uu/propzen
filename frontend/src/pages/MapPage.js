import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CITIES = [
  { name: 'Hyderabad', lat: 17.385, lng: 78.487, emoji: '🕌', state: 'Telangana' },
  { name: 'Bangalore', lat: 12.972, lng: 77.594, emoji: '🌿', state: 'Karnataka' },
  { name: 'Mumbai',    lat: 19.076, lng: 72.877, emoji: '🌊', state: 'Maharashtra' },
  { name: 'Delhi',     lat: 28.704, lng: 77.102, emoji: '🏛️', state: 'Delhi NCR' },
  { name: 'Chennai',   lat: 13.083, lng: 80.270, emoji: '🎭', state: 'Tamil Nadu' },
  { name: 'Pune',      lat: 18.520, lng: 73.856, emoji: '🎓', state: 'Maharashtra' },
  { name: 'Kolkata',   lat: 22.572, lng: 88.363, emoji: '🎨', state: 'West Bengal' },
  { name: 'Ahmedabad', lat: 23.023, lng: 72.572, emoji: '🏗️', state: 'Gujarat' },
  { name: 'Jaipur',    lat: 26.912, lng: 75.787, emoji: '🏰', state: 'Rajasthan' },
  { name: 'Surat',     lat: 21.170, lng: 72.831, emoji: '💎', state: 'Gujarat' },
];

function MapMover({ lat, lng }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 12, { animate: true }); }, [lat, lng, map]);
  return null;
}

function Clicker({ onPick }) {
  useMapEvents({ click: e => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function MapPage({ user, onLocationSelected }) {
  const [selected, setSelected] = useState({ lat: 17.385, lng: 78.487, city: 'Hyderabad', state: 'Telangana' });
  const [pinned, setPinned] = useState(false);

  const pickCity = (city) => {
    setSelected({ lat: city.lat, lng: city.lng, city: city.name, state: city.state });
    setPinned(false);
  };

  const pickOnMap = (lat, lng) => {
    const nearby = CITIES.reduce((best, c) => {
      const d = Math.hypot(c.lat - lat, c.lng - lng);
      return d < best.d ? { c, d } : best;
    }, { c: CITIES[0], d: Infinity });
    setSelected({ lat, lng, city: nearby.c.name, state: nearby.c.state });
    setPinned(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">Step 3 of 6</div>
        <h1 className="page-title">Select Your Location</h1>
        <p className="page-sub">Click on the map or choose a city below to pin your area</p>
      </div>

      <div className="map-layout">
        <div className="city-grid">
          {CITIES.map(city => (
            <button
              key={city.name}
              className={`city-card ${selected.city === city.name ? 'active' : ''}`}
              onClick={() => pickCity(city)}
            >
              <span className="city-emoji">{city.emoji}</span>
              <span className="city-name">{city.name}</span>
              <span className="city-state">{city.state}</span>
            </button>
          ))}
        </div>

        <div className="map-side">
          <div className="map-wrapper">
            <MapContainer center={[selected.lat, selected.lng]} zoom={12}
              style={{ height: '420px', width: '100%', borderRadius: '12px' }}>
              <TileLayer attribution='© OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer>
              <MapMover lat={selected.lat} lng={selected.lng} />
              <Clicker onPick={pickOnMap} />
              <Marker position={[selected.lat, selected.lng]}>
                <Popup>
                  <strong>📍 {selected.city}</strong><br />
                  {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="selected-summary">
            <div className="sum-item">
              <span className="sum-label">📍 City</span>
              <span className="sum-val">{selected.city}</span>
            </div>
            <div className="sum-item">
              <span className="sum-label">🗺️ State</span>
              <span className="sum-val">{selected.state}</span>
            </div>
            <div className="sum-item">
              <span className="sum-label">📌 Pinned</span>
              <span className="sum-val">{pinned ? 'Custom point' : 'City centre'}</span>
            </div>
          </div>

          <button className="primary-btn full-btn" onClick={() => onLocationSelected(selected)}>
            Confirm Location →
          </button>
        </div>
      </div>
    </div>
  );
}