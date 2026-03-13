import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { emissions, YEARS, kpi } from '../data/mockData';
import { treeEquivalent, evKmEquivalent, flightEquivalent } from '../utils/forecast';

Chart.register(...registerables);

export default function EmissionsPage() {
  const scopeRef = useRef<HTMLCanvasElement>(null);
  const scopeChart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!scopeRef.current) return;
    scopeChart.current?.destroy();

    scopeChart.current = new Chart(scopeRef.current, {
      type: 'bar',
      data: {
        labels: YEARS,
        datasets: [
          { label: 'Scope 2 (электричество)', data: emissions.scope2, backgroundColor: '#378ADD', borderRadius: 3, borderSkipped: false },
          { label: 'Scope 1 (газ/тепло)',     data: emissions.scope1, backgroundColor: '#EF9F27', borderRadius: 3, borderSkipped: false },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: {
          x: { stacked: true, ticks: { font: { size: 11 } } },
          y: { stacked: true, ticks: { font: { size: 11 } }, title: { display: true, text: 'т CO₂e', font: { size: 11 } } },
        },
      },
    });

    return () => { scopeChart.current?.destroy(); };
  }, []);

  const trees = treeEquivalent(kpi.totalCO2).toLocaleString();
  const evKm = (evKmEquivalent(kpi.totalCO2) / 1_000_000).toFixed(1) + 'M';
  const flights = flightEquivalent(kpi.totalCO2).toLocaleString();

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Выбросы CO₂</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Scope 1 (прямые) и Scope 2 (электроэнергия)</div>

      {/* Equivalents */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[
          { num: trees, desc: 'деревьев нужно посадить для компенсации' },
          { num: evKm,  desc: 'км на электромобиле = тот же след' },
          { num: flights, desc: 'рейсов Алматы — Москва' },
        ].map(e => (
          <div key={e.desc} style={{ flex: 1, background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#1A7F4B' }}>{e.num}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{e.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Динамика выбросов 2019–2023 (т CO₂e)</div>
        <div style={{ position: 'relative', height: 280 }}><canvas ref={scopeRef} /></div>
      </div>
    </div>
  );
}
