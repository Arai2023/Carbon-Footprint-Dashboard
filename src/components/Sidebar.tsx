import { useState } from 'react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  year: string;
  building: string;
  onYearChange: (y: string) => void;
  onBuildingChange: (b: string) => void;
}

const NAV_ITEMS = [
  { id: 'home',        icon: '◎', label: 'Главная' },
  { id: 'electricity', icon: '⚡', label: 'Электроэнергия' },
  { id: 'emissions',   icon: '☁', label: 'Выбросы CO₂' },
  { id: 'buildings',   icon: '◫', label: 'Здания' },
  { id: 'forecast',    icon: '◈', label: 'Прогноз' },
  { id: 'about',       icon: '◷', label: 'О проекте' },
];

export default function Sidebar({ activePage, onNavigate, year, building, onYearChange, onBuildingChange }: SidebarProps) {
  return (
    <aside style={{
      width: 200, flexShrink: 0, background: '#fff',
      borderRight: '0.5px solid #e5e5e5',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 14px', borderBottom: '0.5px solid #e5e5e5' }}>
        <div style={{ width: 22, height: 22, background: '#1A7F4B', borderRadius: '50% 0 50% 0', marginBottom: 8 }} />
        <div style={{ fontSize: 13, fontWeight: 500 }}>Carbon Dashboard</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>KBTU University</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px', fontSize: 13, cursor: 'pointer',
              color: activePage === item.id ? '#1A7F4B' : '#666',
              fontWeight: activePage === item.id ? 500 : 400,
              background: activePage === item.id ? '#f0faf5' : 'transparent',
              borderLeft: activePage === item.id ? '2px solid #1A7F4B' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 14, width: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* Filters */}
      <div style={{ padding: '10px 16px 16px', borderTop: '0.5px solid #e5e5e5' }}>
        <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Фильтры
        </div>
        <select
          value={year}
          onChange={e => onYearChange(e.target.value)}
          style={{ width: '100%', fontSize: 12, padding: '5px 8px', border: '0.5px solid #ddd', borderRadius: 6, marginBottom: 6, background: '#fafafa', cursor: 'pointer' }}
        >
          <option value="all">Все годы</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <select
          value={building}
          onChange={e => onBuildingChange(e.target.value)}
          style={{ width: '100%', fontSize: 12, padding: '5px 8px', border: '0.5px solid #ddd', borderRadius: 6, background: '#fafafa', cursor: 'pointer' }}
        >
          <option value="all">Все корпуса</option>
          <option value="Корпус A">Корпус A</option>
          <option value="Корпус B">Корпус B</option>
          <option value="Корпус C">Корпус C</option>
          <option value="Корпус D">Корпус D</option>
          <option value="Корпус E">Корпус E</option>
        </select>
      </div>
    </aside>
  );
}
