import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { MONTHS } from '../data/mockData';
import { Translations } from '../utils/i18n';
import { useData } from '../context/DataContext';

Chart.register(...registerables);

interface Props { year: string; building: string; t: Translations; }

const card = {
  background: '#fff', borderRadius: 16, padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
};

export default function ElectricityPage({ year, building, t }: Props) {
  const lineRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const lineChart = useRef<Chart | null>(null);
  const barChart = useRef<Chart | null>(null);
  const { data } = useData();

  const filteredBuildings = building === 'all' ? data.buildings : data.buildings.filter(b => b.name === building);

  useEffect(() => {
    if (!lineRef.current || !barRef.current) return;
    lineChart.current?.destroy();
    barChart.current?.destroy();

    lineChart.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [
          { label: '2023', data: data.electricity[2023], borderColor: '#7EC8C8', backgroundColor: 'rgba(126,200,200,0.1)', tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2.5 },
          { label: '2022', data: data.electricity[2022], borderColor: '#A8C5DA', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, borderDash: [5,3], borderWidth: 2 },
          { label: '2021', data: data.electricity[2021], borderColor: '#C9DCE8', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, borderDash: [3,4], borderWidth: 1.5 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: {
          x: { ticks: { font: { size: 10 } }, grid: { display: false } },
          y: { ticks: { font: { size: 10 } }, grid: { color: '#f0f4f8' }, title: { display: true, text: 'МВтч', font: { size: 10 } } },
        },
      },
    });

    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: filteredBuildings.map(b => b.name),
        datasets: [{ data: filteredBuildings.map(b => b.kwh), backgroundColor: filteredBuildings.map(b => b.green ? 'rgba(126,200,200,0.8)' : 'rgba(244,169,168,0.8)'), borderRadius: 6 }],
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font: { size: 10 } }, grid: { color: '#f0f4f8' }, title: { display: true, text: 'МВтч', font: { size: 10 } } },
          y: { ticks: { font: { size: 11 } }, grid: { display: false } },
        },
      },
    });

    return () => { lineChart.current?.destroy(); barChart.current?.destroy(); };
  }, [year, building, JSON.stringify(data.electricity), JSON.stringify(data.buildings)]);

  const kpi = data.kpi;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>{t.electricity.title}</div>
        <div style={{ fontSize: 13, color: '#7a9ab0' }}>{t.electricity.subtitle}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: t.electricity.total,      value: kpi.totalKwh.toLocaleString(), unit: 'МВтч', icon: '⚡' },
          { label: t.electricity.peak,       value: '912',   unit: 'МВтч', icon: '📈' },
          { label: t.electricity.perStudent, value: '1 635', unit: 'кВтч', icon: '🎓' },
          { label: t.electricity.coeff,      value: data.co2Coefficient.toString(), unit: 'кг/кВтч', icon: '🌿' },
        ].map(c => (
          <div key={c.label} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#7a9ab0', fontWeight: 500 }}>{c.label}</div>
              <span style={{ fontSize: 20 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332' }}>
              {c.value} <span style={{ fontSize: 12, color: '#7a9ab0', fontWeight: 400 }}>{c.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', marginBottom: 16 }}>{t.electricity.byMonth}</div>
          <div style={{ position: 'relative', height: 260 }}><canvas ref={lineRef} /></div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', marginBottom: 16 }}>{t.electricity.byBuilding}</div>
          <div style={{ position: 'relative', height: 260 }}><canvas ref={barRef} /></div>
        </div>
      </div>
    </div>
  );
}
