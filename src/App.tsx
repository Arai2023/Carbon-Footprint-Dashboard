import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './pages/admin/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import HomePage from './pages/HomePage';
import ElectricityPage from './pages/ElectricityPage';
import EmissionsPage from './pages/EmissionsPage';
import BuildingsPage from './pages/BuildingsPage';
import ForecastPage from './pages/ForecastPage';
import AboutPage from './pages/AboutPage';
import { translations, Lang } from './utils/i18n';
// 1. Импортируем компонент экспорта
import ExportButton from './components/ExportButton';

type Route = 'dashboard' | 'login' | 'admin';

function AppInner() {
  const { user } = useAuth();
  const [route, setRoute] = useState<Route>('dashboard');
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

  // 2. Названия файлов для экспорта (без вкладки editor)
  const exportFilename: Record<string, string> = {
    home: 'KBTU_Carbon_Overview',
    electricity: 'KBTU_Electricity',
    emissions: 'KBTU_Emissions',
    buildings: 'KBTU_Buildings',
    forecast: 'KBTU_Forecast',
  };

  if (route === 'login') {
    return <LoginPage onSuccess={() => setRoute('admin')} />;
  }

  if (route === 'admin') {
    if (!user) return <LoginPage onSuccess={() => setRoute('admin')} />;
    return <AdminPage onNavigate={() => setRoute('dashboard')} />;
  }

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
      <header style={{ background: '#fff', boxShadow: '0 2px 20px rgba(126,200,200,0.15)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7EC8C8, #A8C5DA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a2332' }}>Carbon Dashboard</div>
              <div style={{ fontSize: 10, color: '#7a9ab0' }}>КБТУ</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', fontSize: 13,
                fontWeight: page === item.id ? 600 : 400,
                background: page === item.id ? '#e8f7f7' : 'transparent',
                color: page === item.id ? '#5aabb0' : '#7a9ab0',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}>
                {item.label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* 3. Кнопка экспорта (появляется, если для страницы задано имя файла) */}
            {exportFilename[page] && (
              <ExportButton targetId="page-content" filename={exportFilename[page]} />
            )}

            <select value={year} onChange={e => setYear(e.target.value)}
              style={{ fontSize: 12, padding: '6px 10px', border: '1px solid #dce8f0', borderRadius: 8, background: '#f0f4f8', color: '#2d4a5a', cursor: 'pointer' }}>
              <option value="all">{t.allYears}</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            <select value={building} onChange={e => setBuilding(e.target.value)}
              style={{ fontSize: 12, padding: '6px 10px', border: '1px solid #dce8f0', borderRadius: 8, background: '#f0f4f8', color: '#2d4a5a', cursor: 'pointer' }}>
              <option value="all">{t.allBuildings}</option>
              <option value="Толе би">Толе би</option>
              <option value="Панфилова">Панфилова</option>
              <option value="Абылай хана">Абылай хана</option>
              <option value="Библиотека">Библиотека</option>
              <option value="Столовая">Столовая</option>
            </select>

            <div style={{ display: 'flex', gap: 4 }}>
              {(['ru', 'kz', 'en'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: '5px 10px', borderRadius: 7, border: '1px solid',
                  borderColor: lang === l ? '#7EC8C8' : '#dce8f0', fontSize: 11, fontWeight: 600,
                  background: lang === l ? '#e8f7f7' : 'transparent',
                  color: lang === l ? '#5aabb0' : '#7a9ab0',
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setRoute(user ? 'admin' : 'login')}
              title="Панель управления"
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e0e0e0', background: user ? '#e8f5ee' : '#f5f5f5', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {user ? '🔓' : '🔒'}
            </button>
          </div>
        </div>
      </header>

      {/* 4. Добавляем id="page-content" к контейнеру main, чтобы экспорт видел содержимое */}
      <main id="page-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppInner />
      </DataProvider>
    </AuthProvider>
  );
}