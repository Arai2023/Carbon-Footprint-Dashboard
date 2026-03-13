import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ElectricityPage from './pages/ElectricityPage';
import EmissionsPage from './pages/EmissionsPage';
import BuildingsPage from './pages/BuildingsPage';
import ForecastPage from './pages/ForecastPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [page, setPage] = useState('home');
  const [year, setYear] = useState('2023');
  const [building, setBuilding] = useState('all');

  const renderPage = () => {
    switch (page) {
      case 'home':        return <HomePage year={year} />;
      case 'electricity': return <ElectricityPage year={year} building={building} />;
      case 'emissions':   return <EmissionsPage />;
      case 'buildings':   return <BuildingsPage />;
      case 'forecast':    return <ForecastPage />;
      case 'about':       return <AboutPage />;
      default:            return <HomePage year={year} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f7f7f5' }}>
      <Sidebar
        activePage={page}
        onNavigate={setPage}
        year={year}
        building={building}
        onYearChange={setYear}
        onBuildingChange={setBuilding}
      />
      <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {renderPage()}
      </main>
    </div>
  );
}
