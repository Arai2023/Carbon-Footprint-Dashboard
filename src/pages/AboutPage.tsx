import { Translations } from '../utils/i18n';

interface Props { t: Translations; }

const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
  marginBottom: 16,
};

export default function AboutPage({ t }: Props) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>{t.about.title}</div>
        <div style={{ fontSize: 13, color: '#7a9ab0' }}>{t.about.subtitle}</div>
      </div>

      {/* Team */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>👥</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.about.team}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { name: 'Arailym Izteleuova', role: 'Frontend, архитектура, дизайн', icon: '💻' },
            { name: 'Dastan Shukanov',       role: 'Данные, расчёты, прогноз',      icon: '📊' },
          ].map(p => (
            <div key={p.name} style={{
              background: 'linear-gradient(135deg, #f0f4f8, #e8f7f7)',
              borderRadius: 12, padding: 16,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #7EC8C8, #A8C5DA)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>{p.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a2332' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#7a9ab0', marginTop: 3 }}>{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>🔬</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.about.methodology}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { title: 'Scope 1', desc: 'Прямые выбросы от сжигания газа и теплоснабжения. Коэффициент: 0.202 кг CO₂e/кВтч', color: '#7EC8C8' },
            { title: 'Scope 2', desc: 'Косвенные выбросы от электроэнергии. Коэффициент: 0.514 кг CO₂e/кВтч (Казахстан)', color: '#A8C5DA' },
            { title: 'Прогноз', desc: 'Линейная экстраполяция методом наименьших квадратов на основе данных 2021–2023', color: '#B8D4E8' },
            { title: 'Эквиваленты', desc: '1 дерево поглощает ~20 кг CO₂/год. Электромобиль потребляет 0.25 кВтч/км', color: '#C9DCE8' },
          ].map(m => (
            <div key={m.title} style={{ background: '#f8fafc', borderRadius: 10, padding: 14, borderLeft: `3px solid ${m.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2332', marginBottom: 6 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: '#7a9ab0', lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>📚</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.about.sources}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '⚡', text: 'Счётчики электроэнергии КБТУ (Excel, энергетический отдел)' },
            { icon: '🌡️', text: 'Отчёты по теплоснабжению и газу (2021–2023)' },
            { icon: '🌍', text: 'Коэффициенты выбросов: Министерство экологии РК, IPCC AR6' },
            { icon: '🎓', text: 'Количество студентов и сотрудников: открытые данные КБТУ' },
          ].map(s => (
            <div key={s.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 13, color: '#2d4a5a' }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div style={{ ...card, marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>🛠️</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.about.stack}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { name: 'React 18',     color: '#7EC8C8' },
            { name: 'TypeScript',   color: '#A8C5DA' },
            { name: 'Chart.js',     color: '#B8D4E8' },
            { name: 'Vite',         color: '#C9DCE8' },
            { name: 'Inter Font',   color: '#7EC8C8' },
          ].map(tech => (
            <span key={tech.name} style={{
              background: '#f0f4f8', color: '#2d4a5a',
              fontSize: 13, fontWeight: 600,
              padding: '8px 16px', borderRadius: 20,
              borderBottom: `2px solid ${tech.color}`,
            }}>
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}