import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import MapPage from './pages/MapPage';
import DetailsPage from './pages/DetailsPage';
import ResultPage from './pages/ResultPage';
import SuggestionsPage from './pages/SuggestionsPage';
import './App.css';

const STEPS = ['Login','Profile','Location','Details','Prediction','Suggestions'];

export default function App() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [details, setDetails] = useState(null);
  const [result, setResult] = useState(null);

  const handleAuth = (u) => { setUser(u); setStep(u.hasProfile ? 2 : 1); };
  const handleProfile = (u) => { setUser(u); setStep(2); };
  const handleLocation = (loc) => { setLocation(loc); setStep(3); };
  const handleDetails = (det) => { setDetails(det); setStep(4); };
  const handleResult = (res) => { setResult(res); setStep(5); };
  const handleRestart = () => { setStep(2); setLocation(null); setDetails(null); setResult(null); };
  const handleLogout = () => { setUser(null); setStep(0); };

  return (
    <div className="app-root">
      {step > 0 && (
        <nav className="top-nav">
          <div className="nav-logo">⚡ <span>PropZen</span></div>
          <div className="progress-steps">
            {STEPS.map((s,i) => (
              <div key={s} className={`prog-step ${i<step?'done':''} ${i===step?'current':''}`}>
                <div className="prog-dot">{i<step?'✓':i+1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
          {user && (
            <div className="nav-user">
              <div className="user-chip">
                <span className="user-av">{user.name?.[0]}</span>
                <span>{user.name}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </nav>
      )}
      <main className="app-main">
        {step===0 && <AuthPage onAuth={handleAuth} />}
        {step===1 && <ProfilePage user={user} onProfileSaved={handleProfile} />}
        {step===2 && <MapPage user={user} onLocationSelected={handleLocation} />}
        {step===3 && <DetailsPage user={user} location={location} onDetailsSubmit={handleDetails} />}
        {step===4 && <ResultPage user={user} location={location} details={details} onNext={handleResult} />}
        {step===5 && <SuggestionsPage user={user} location={location} details={details} result={result} onRestart={handleRestart} />}
      </main>
    </div>
  );
}