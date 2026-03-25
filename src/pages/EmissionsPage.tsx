import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { YEARS } from '../data/mockData';
import { treeEquivalent, evKmEquivalent, flightEquivalent } from '../utils/forecast';
import { Translations } from '../utils/i18n';
import { useData } from '../context/DataContext';

Chart.register(...registerables);

interface Props { t: Translations; }

const card = {
  background: '#fff', borderRadius: 16, padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
};

export default function EmissionsPage({ t }: Props) {
  const scopeRef = useRef<HTMLCanvasElement>(null);
  const scopeChart = useRef<Chart | null>(null);
  const { data } = useData();

  useEffect(() => {
    if (!scopeRef.current) return;
    scopeChart.current?.destroy();

    scopeChart.current = new Chart(scopeRef.current, {
      type: 'bar',
      data: {
        labels: YEARS,
        datasets: [
          { label: 'Scope 2 (электричество)', data: data.emissions.scope2, backgroundColor: 'rgba(168,197,218,0.8)', borderRadius: 6 },
          { label: 'Scope 1 (газ/тепло)',     data: data.emissions.scope1, backgroundColor: 'rgba(126,200,200,0.8)', borderRadius: 6 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: {
          x: { stacked: true, ticks: { font: { size: 11 } }, grid: { display: false } },
          y: { stacked: true, ticks: { font: { size: 11 } }, grid: { color: '#f0f4f8' }, title: { display: true, text: 'т CO₂e', font: { size: 11 } } },
        },
      },
    });

    return () => { scopeChart.current?.destroy(); };
  }, [JSON.stringify(data.emissions)]);

  const total = data.kpi.totalCO2;
  const trees = treeEquivalent(total).toLocaleString();
  const evKm = (evKmEquivalent(total) / 1_000_000).toFixed(1) + 'M';
  const flights = flightEquivalent(total).toLocaleString();

  const equivalents = [
    { num: trees,   desc: t.emissions.trees,   icon: '🌳', color: '#7EC8C8', bg: '#e8f7f7' },
    { num: evKm,    desc: t.emissions.evkm,    icon: '⚡', color: '#A8C5DA', bg: '#e8f2f9' },
    { num: flights, desc: t.emissions.flights, icon: '✈️', color: '#B8D4E8', bg: '#eef4f9' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>{t.emissions.title}</div>
        <div style={{ fontSize: 13, color: '#7a9ab0' }}>{t.emissions.subtitle}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {equivalents.map(e => (
          <div key={e.desc} style={{ ...card, textAlign: 'center', border: `1px solid ${e.bg}` }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{e.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: e.color, marginBottom: 6 }}>{e.num}</div>
            <div style={{ fontSize: 12, color: '#7a9ab0', lineHeight: 1.5 }}>{e.desc}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{t.emissions.chart}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[{ color: 'rgba(168,197,218,0.8)', label: 'Scope 2' }, { color: 'rgba(126,200,200,0.8)', label: 'Scope 1' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7a9ab0' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', height: 300 }}><canvas ref={scopeRef} /></div>
      </div>
    </div>
  );
}
