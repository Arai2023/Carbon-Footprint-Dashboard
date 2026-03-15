import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Translations } from '../utils/i18n';

Chart.register(...registerables);

interface Props { t: Translations; }

const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
};

const greenBuildings = [
  { name: 'Библиотека',     kgPerSqm: 22.1 },
  { name: '5 этаж',         kgPerSqm: 25.4 },
  { name: 'Столовая',       kgPerSqm: 28.8 },
];

const dirtyBuildings = [
  { name: 'Толе би',        kgPerSqm: 62.3 },
  { name: 'Панфилова',      kgPerSqm: 55.1 },
  { name: 'Абылай хана',    kgPerSqm: 47.6 },
  { name: 'Цокольный этаж', kgPerSqm: 44.2 },
];

export default function BuildingsPage({ t }: Props) {
  const radarRef = useRef<HTMLCanvasElement>(null);
  const radarChart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!radarRef.current) return;
    radarChart.current?.destroy();

    radarChart.current = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels: ['Электроэнергия', 'Тепло', 'Транспорт', 'Отходы', 'Эффективность'],
        datasets: [
          { label: 'Толе би',     data: [85,70,40,50,30], borderColor: '#f4a9a8', backgroundColor: 'rgba(244,169,168,0.15)', pointRadius: 4, borderWidth: 2 },
          { label: 'Абылай хана', data: [60,55,35,30,55], borderColor: '#A8C5DA', backgroundColor: 'rgba(168,197,218,0.15)', pointRadius: 4, borderWidth: 2 },
          { label: 'Библиотека',  data: [30,25,20,15,85], borderColor: '#7EC8C8', backgroundColor: 'rgba(126,200,200,0.15)', pointRadius: 4, borderWidth: 2 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: { r: { ticks: { font: { size: 9 }, stepSize: 20, backdropColor: 'transparent' }, pointLabels: { font: { size: 11 } }, min: 0, max: 100, grid: { color: '#f0f4f8' } } },
      },
    });

    return () => { radarChart.current?.destroy(); };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>{t.buildings.title}</div>
        <div style={{ fontSize: 13, color: '#7a9ab0' }}>{t.buildings.subtitle}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Green */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🌿</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.buildings.green}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f4f8' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.num}</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.name}</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.kgSqm}</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.grade}</th>
              </tr>
            </thead>
            <tbody>
              {greenBuildings.map((b, i) => (
                <tr key={b.name} style={{ borderBottom: '1px solid #f0f4f8' }}>
                  <td style={{ padding: '10px', fontSize: 12, color: '#7a9ab0' }}>{i + 1}</td>
                  <td style={{ padding: '10px', fontSize: 13, fontWeight: 500, color: '#1a2332' }}>{b.name}</td>
                  <td style={{ padding: '10px', fontSize: 13, color: '#1a2332' }}>{b.kgPerSqm}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#e8f7f7', color: '#5aabb0', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                      {t.buildings.good}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dirty */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🏭</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.buildings.dirty}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f4f8' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.num}</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.name}</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.kgSqm}</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: '#7a9ab0', fontWeight: 500, fontSize: 11 }}>{t.buildings.grade}</th>
              </tr>
            </thead>
            <tbody>
              {dirtyBuildings.map((b, i) => (
                <tr key={b.name} style={{ borderBottom: '1px solid #f0f4f8' }}>
                  <td style={{ padding: '10px', fontSize: 12, color: '#7a9ab0' }}>{i + 1}</td>
                  <td style={{ padding: '10px', fontSize: 13, fontWeight: 500, color: '#1a2332' }}>{b.name}</td>
                  <td style={{ padding: '10px', fontSize: 13, color: '#1a2332' }}>{b.kgPerSqm}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#fdecea', color: '#c0392b', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                      {t.buildings.high}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar */}
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