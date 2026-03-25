import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Translations } from '../utils/i18n';
import { useData } from '../context/DataContext';

Chart.register(...registerables);

interface Props { t: Translations; }

const card = {
  background: '#fff', borderRadius: 16, padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
};

export default function BuildingsPage({ t }: Props) {
  const radarRef = useRef<HTMLCanvasElement>(null);
  const radarChart = useRef<Chart | null>(null);
  const { data } = useData();

  const greenBuildings = data.buildings.filter(b => b.green).map(b => ({
    name: b.name, kgPerSqm: b.area > 0 ? Math.round((b.kwh * 1000 * 0.514) / b.area * 10) / 10 : 0,
  }));
  const dirtyBuildings = data.buildings.filter(b => !b.green).map(b => ({
    name: b.name, kgPerSqm: b.area > 0 ? Math.round((b.kwh * 1000 * 0.514) / b.area * 10) / 10 : 0,
  }));

  useEffect(() => {
    if (!radarRef.current) return;
    radarChart.current?.destroy();

    const allBuildings = data.buildings.slice(0, 3);
    radarChart.current = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels: ['Электроэнергия', 'Тепло', 'Транспорт', 'Отходы', 'Эффективность'],
        datasets: allBuildings.map((b, i) => {
          const colors = ['#f4a9a8', '#A8C5DA', '#7EC8C8'];
          const score = b.area > 0 ? Math.min(100, Math.round(b.kwh / b.area * 10)) : 50;
          return {
            label: b.name,
            data: [score, Math.round(score * 0.8), 40, 30, b.green ? 85 : 35],
            borderColor: colors[i] || '#ccc',
            backgroundColor: (colors[i] || '#ccc') + '26',
            pointRadius: 4, borderWidth: 2,
          };
        }),
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: { r: { ticks: { font: { size: 9 }, stepSize: 20, backdropColor: 'transparent' }, pointLabels: { font: { size: 11 } }, min: 0, max: 100, grid: { color: '#f0f4f8' } } },
      },
    });

    return () => { radarChart.current?.destroy(); };
  }, [JSON.stringify(data.buildings)]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>{t.buildings.title}</div>
        <div style={{ fontSize: 13, color: '#7a9ab0' }}>{t.buildings.subtitle}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {[
          { list: greenBuildings, icon: '🌿', title: t.buildings.green, badge: t.buildings.good, badgeBg: '#e8f7f7', badgeColor: '#5aabb0' },
          { list: dirtyBuildings, icon: '🏭', title: t.buildings.dirty, badge: t.buildings.high, badgeBg: '#fdecea', badgeColor: '#c0392b' },
        ].map(section => (
          <div key={section.title} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>{section.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{section.title}</div>
            </div>
            {section.list.length === 0 ? (
              <div style={{ fontSize: 13, color: '#7a9ab0', padding: '16px 0' }}>Нет зданий в этой категории</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f4f8' }}>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>#</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.name}</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.kgSqm}</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.grade}</th>
                  </tr>
                </thead>
                <tbody>
                  {section.list.map((b, i) => (
                    <tr key={b.name} style={{ borderBottom: '1px solid #f0f4f8' }}>
                      <td style={{ padding: '10px', fontSize: 12, color: '#7a9ab0' }}>{i + 1}</td>
                      <td style={{ padding: '10px', fontSize: 13, fontWeight: 500, color: '#1a2332' }}>{b.name}</td>
                      <td style={{ padding: '10px', fontSize: 13, color: '#1a2332' }}>{b.kgPerSqm}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ background: section.badgeBg, color: section.badgeColor, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                          {section.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>📡</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.buildings.radar}</div>
        </div>
        <div style={{ position: 'relative', height: 300 }}><canvas ref={radarRef} /></div>
      </div>
    </div>
  );
}
