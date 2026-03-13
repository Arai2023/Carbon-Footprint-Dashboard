import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const greenBuildings = [
  { name: 'Корпус E',      kgPerSqm: 22.1 },
  { name: 'Библиотека',    kgPerSqm: 25.4 },
  { name: 'Корпус D',      kgPerSqm: 28.8 },
  { name: 'Общежитие 1',   kgPerSqm: 30.2 },
  { name: 'Спорткомплекс', kgPerSqm: 31.7 },
];

const dirtyBuildings = [
  { name: 'Серверная',   kgPerSqm: 89.4 },
  { name: 'Корпус A',    kgPerSqm: 62.3 },
  { name: 'Лаборатория', kgPerSqm: 55.1 },
  { name: 'Столовая',    kgPerSqm: 47.6 },
  { name: 'Корпус B',    kgPerSqm: 44.2 },
];

function badge(label: string, green: boolean) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 10, fontSize: 10, fontWeight: 500,
      background: green ? '#e0f5ea' : '#fdecea',
      color: green ? '#1A7F4B' : '#c0392b',
    }}>{label}</span>
  );
}

function greenLabel(v: number) {
  if (v < 25) return ['Отлично', true];
  if (v < 32) return ['Хорошо', true];
  return ['Норма', true];
}
function dirtyLabel(v: number) {
  if (v > 80) return ['Критично', false];
  if (v > 55) return ['Высокий', false];
  return ['Повышен', false];
}

export default function BuildingsPage() {
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
          { label: 'Корпус A', data: [85, 70, 40, 50, 30], borderColor: '#E24B4A', backgroundColor: 'rgba(226,75,74,0.1)', pointRadius: 3 },
          { label: 'Корпус C', data: [60, 55, 35, 30, 55], borderColor: '#EF9F27', backgroundColor: 'rgba(239,159,39,0.1)', pointRadius: 3 },
          { label: 'Корпус E', data: [30, 25, 20, 15, 85], borderColor: '#1A7F4B', backgroundColor: 'rgba(26,127,75,0.1)', pointRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: { r: { ticks: { font: { size: 9 }, stepSize: 20 }, pointLabels: { font: { size: 10 } }, min: 0, max: 100 } },
      },
    });

    return () => { radarChart.current?.destroy(); };
  }, []);

  const thStyle = { textAlign: 'left' as const, padding: '8px 10px', borderBottom: '0.5px solid #e5e5e5', color: '#888', fontWeight: 500, fontSize: 11 };
  const tdStyle = { padding: '7px 10px', borderBottom: '0.5px solid #f0f0f0', fontSize: 12 };

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Здания и факультеты</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Сравнительный анализ по корпусам</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        {/* Green */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Топ-5 зелёных зданий</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={thStyle}>#</th><th style={thStyle}>Корпус</th><th style={thStyle}>кг CO₂e/м²</th><th style={thStyle}>Оценка</th></tr></thead>
            <tbody>
              {greenBuildings.map((b, i) => {
                const [lbl, grn] = greenLabel(b.kgPerSqm);
                return (
                  <tr key={b.name}>
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={tdStyle}>{b.name}</td>
                    <td style={tdStyle}>{b.kgPerSqm}</td>
                    <td style={tdStyle}>{badge(lbl as string, grn as boolean)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dirty */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Топ-5 зданий с высоким следом</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={thStyle}>#</th><th style={thStyle}>Корпус</th><th style={thStyle}>кг CO₂e/м²</th><th style={thStyle}>Оценка</th></tr></thead>
            <tbody>
              {dirtyBuildings.map((b, i) => {
                const [lbl, grn] = dirtyLabel(b.kgPerSqm);
                return (
                  <tr key={b.name}>
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={tdStyle}>{b.name}</td>
                    <td style={tdStyle}>{b.kgPerSqm}</td>
                    <td style={tdStyle}>{badge(lbl as string, grn as boolean)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Радар-чарт: профиль выбросов по корпусам</div>
        <div style={{ position: 'relative', height: 280 }}><canvas ref={radarRef} /></div>
      </div>
    </div>
  );
}
