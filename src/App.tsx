import { useState } from 'react';
import HomePage from './pages/HomePage';
import ElectricityPage from './pages/ElectricityPage';
import EmissionsPage from './pages/EmissionsPage';
import BuildingsPage from './pages/BuildingsPage';
import ForecastPage from './pages/ForecastPage';
import AboutPage from './pages/AboutPage';
import { translations, Lang } from './utils/i18n';

export default function App() {
  const [page, setPage] = useState('home');
  const [year, setYear] = useState('2023');
  const [building, setBuilding] = useState('all');
  const [lang, setLang] = useState<Lang>('ru');

  const t = translations[lang];

  const navItems = [
    { id: 'home',        label: t.nav.home },
    { id: 'electricity', label: t.nav.electricity },
    { id: 'emissions',   label: t.nav.emissions },
    { id: 'buildings',   label: t.nav.buildings },
    { id: 'forecast',    label: t.nav.forecast },
    { id: 'about',       label: t.nav.about },
  ];

  const renderPage = () => {
    switch (page) {
      case 'home':        return <HomePage year={year} t={t} />;
      case 'electricity': return <ElectricityPage year={year} building={building} t={t} />;
      case 'emissions':   return <EmissionsPage t={t} />;
      case 'buildings':   return <BuildingsPage t={t} />;
      case 'forecast':    return <ForecastPage t={t} />;
      case 'about':       return <AboutPage t={t} />;
      default:            return <HomePage year={year} t={t} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef2f7' }}>

      {/* NAVBAR */}
      <header style={{
        background: '#fff',
        boxShadow: '0 2px 20px rgba(126,200,200,0.15)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #7EC8C8, #A8C5DA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>🌿</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a2332' }}>Carbon Dashboard</div>
              <div style={{ fontSize: 10, color: '#7a9ab0' }}>KBTU</div>
            </div>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: 'none',
                  fontSize: 13, fontWeight: page === item.id ? 600 : 400,
                  background: page === item.id ? '#e8f7f7' : 'transparent',
                  color: page === item.id ? '#5aabb0' : '#7a9ab0',
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Filters + Lang */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{
                fontSize: 12, padding: '6px 10px',
                border: '1px solid #dce8f0', borderRadius: 8,
                background: '#f0f4f8', color: '#2d4a5a', cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              <option value="all">{t.allYears}</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            <select
              value={building}
              onChange={e => setBuilding(e.target.value)}
              style={{
                fontSize: 12, padding: '6px 10px',
                border: '1px solid #dce8f0', borderRadius: 8,
                background: '#f0f4f8', color: '#2d4a5a', cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              <option value="all">{t.allBuildings}</option>
              <option value="Толе би">Толе би</option>
              <option value="Панфилова">Панфилова</option>
              <option value="Абылай хана">Абылай хана</option>
              <option value="Библиотека">Библиотека</option>
              <option value="Столовая">Столовая</option>
            </select>

            {/* Language */}
            <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
              {(['ru', 'kz', 'en'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '5px 10px', borderRadius: 7, border: '1px solid',
                    borderColor: lang === l ? '#7EC8C8' : '#dce8f0',
                    fontSize: 11, fontWeight: 600,
                    background: lang === l ? '#e8f7f7' : 'transparent',
                    color: lang === l ? '#5aabb0' : '#7a9ab0',
                    cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {renderPage()}
      </main>
    </div>
  );
}