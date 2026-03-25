import { Lang, Translations } from '../utils/i18n';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  year: string;
  building: string;
  onYearChange: (y: string) => void;
  onBuildingChange: (b: string) => void;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  t: Translations;
}

export default function Sidebar({ activePage, onNavigate, year, building, onYearChange, onBuildingChange, lang, onLangChange, t }: SidebarProps) {
  const navItems = [
    { id: 'home',        icon: '◎', label: t.nav.home },
    { id: 'electricity', icon: '⚡', label: t.nav.electricity },
    { id: 'emissions',   icon: '☁', label: t.nav.emissions },
    { id: 'buildings',   icon: '◫', label: t.nav.buildings },
    { id: 'forecast',    icon: '◈', label: t.nav.forecast },
    { id: 'about',       icon: '◷', label: t.nav.about },
  ];

  return (
    <aside style={{
      width: 210, flexShrink: 0, background: '#fff',
      borderRight: '1px solid #dce8f0',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid #dce8f0' }}>
        <div style={{ width: 22, height: 22, background: '#7EC8C8', borderRadius: '50% 0 50% 0', marginBottom: 8 }} />
        <div style={{ fontSize: 13, fontWeight: 500, color: '#2d4a5a' }}>{t.appName}</div>
        <div style={{ fontSize: 10, color: '#7a9ab0', marginTop: 2, lineHeight: 1.4 }}>{t.university}</div>
      </div>

      {/* Language switcher */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #dce8f0', display: 'flex', gap: 6 }}>
        {(['ru', 'kz', 'en'] as Lang[]).map(l => (
          <button
            key={l}
            onClick={() => onLangChange(l)}
            style={{
              flex: 1, padding: '4px 0', fontSize: 11, fontWeight: 500,
              border: '1px solid',
              borderColor: lang === l ? '#7EC8C8' : '#dce8f0',
              borderRadius: 6, cursor: 'pointer',
              background: lang === l ? '#e8f7f7' : 'transparent',
              color: lang === l ? '#5aabb0' : '#7a9ab0',
              transition: 'all 0.15s',
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px', fontSize: 13, cursor: 'pointer',
              color: activePage === item.id ? '#5aabb0' : '#7a9ab0',
              fontWeight: activePage === item.id ? 500 : 400,
              background: activePage === item.id ? '#e8f7f7' : 'transparent',
              borderLeft: activePage === item.id ? '2px solid #7EC8C8' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 14, width: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* Filters */}
      <div style={{ padding: '10px 16px 16px', borderTop: '1px solid #dce8f0' }}>
        <div style={{ fontSize: 10, color: '#7a9ab0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          {t.filters}
        </div>
        <select
          value={year}
          onChange={e => onYearChange(e.target.value)}
          style={{ width: '100%', fontSize: 12, padding: '5px 8px', border: '1px solid #dce8f0', borderRadius: 6, marginBottom: 6, background: '#f0f4f8', color: '#2d4a5a', cursor: 'pointer' }}
        >
          <option value="all">{t.allYears}</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <select
          value={building}
          onChange={e => onBuildingChange(e.target.value)}
          style={{ width: '100%', fontSize: 12, padding: '5px 8px', border: '1px solid #dce8f0', borderRadius: 6, background: '#f0f4f8', color: '#2d4a5a', cursor: 'pointer' }}
        >
          <option value="all">{t.allBuildings}</option>
          <option value="Толе би">Толе би</option>
          <option value="Панфилова">Панфилова</option>
          <option value="Абылай хана">Абылай хана</option>
          <option value="Библиотека">Библиотека</option>
          <option value="Столовая">Столовая</option>
        </select>
      </div>
    </aside>
  );
}