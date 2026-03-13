export default function AboutPage() {
  const cardStyle = {
    background: '#fff', border: '0.5px solid #e5e5e5',
    borderRadius: 12, padding: 16, marginBottom: 12,
  };

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>О проекте</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Методология и источники данных</div>

      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Команда</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { name: 'Arailym Izteleuova', role: 'Frontend, архитектура, дизайн' },
            { name: 'Dastan Shukhanov',   role: 'Данные, расчёты, прогноз' },
          ].map(p => (
            <div key={p.name} style={{ flex: 1, background: '#f8f8f8', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{p.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Методология расчётов</div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.9 }}>
          <strong style={{ color: '#333' }}>Scope 1</strong> — прямые выбросы от сжигания газа и теплоснабжения. Коэффициент: 0.202 кг CO₂e/кВтч тепла.<br />
          <strong style={{ color: '#333' }}>Scope 2</strong> — косвенные выбросы от покупной электроэнергии. Коэффициент: 0.514 кг CO₂e/кВтч (сеть Казахстана, 2023).<br />
          <strong style={{ color: '#333' }}>Прогноз</strong> — линейная экстраполяция методом наименьших квадратов на основе данных 2019–2023.<br />
          <strong style={{ color: '#333' }}>Эквиваленты</strong> — 1 дерево поглощает ~20 кг CO₂/год; электромобиль 0.25 кВтч/км.
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Источники данных</div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 2 }}>
          • Счётчики электроэнергии KBTU (Excel, энергетический отдел)<br />
          • Отчёты по теплоснабжению и газу (2019–2023)<br />
          • Коэффициенты выбросов: Министерство экологии РК, IPCC AR6<br />
          • Количество студентов и сотрудников: открытые данные KBTU<br />
          • GitHub: <a href="https://github.com/Arai2023/Carbon-Footprint-Dashboard" style={{ color: '#1A7F4B' }}>github.com/Arai2023/Carbon-Footprint-Dashboard</a>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Технологический стек</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['React 18', 'TypeScript', 'Chart.js', 'Recharts', 'Vite', 'Vercel'].map(t => (
            <span key={t} style={{ background: '#f0faf5', color: '#1A7F4B', fontSize: 12, padding: '4px 10px', borderRadius: 6, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
