import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { forecast } from '../data/mockData';
import { Translations } from '../utils/i18n';

Chart.register(...registerables);

interface Props { t: Translations; }

const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
};

export default function ForecastPage({ t }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);

  const nullHist = new Array(forecast.future.years.length).fill(null);
  const nullFut  = new Array(forecast.historical.years.length).fill(null);

  useEffect(() => {
    if (!chartRef.current) return;
    chart.current?.destroy();

    chart.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: [...forecast.historical.years, ...forecast.future.years],
        datasets: [
          {
            label: t.forecast.history,
            data: [...forecast.historical.data, ...nullHist],
            borderColor: '#f4a9a8', backgroundColor: 'rgba(244,169,168,0.15)',
            fill: true, tension: 0.4, pointRadius: 5, borderWidth: 2.5,
          },
          {
            label: t.forecast.scenario1,
            data: [...nullFut, ...forecast.future.bau],
            borderColor: '#C9DCE8', borderDash: [6,4], tension: 0.4,
            pointRadius: 3, borderWidth: 2, fill: false,
          },
          {
            label: t.forecast.scenario2,
            data: [...nullFut, ...forecast.future.target],
            borderColor: '#A8C5DA', borderDash: [6,4], tension: 0.4,
            pointRadius: 3, borderWidth: 2, fill: false,
          },
          {
            label: t.forecast.scenario3,
            data: [...nullFut, ...forecast.future.measures],
            borderColor: '#7EC8C8', tension: 0.4,
            pointRadius: 3, borderWidth: 2.5, fill: false,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10, padding: 16 } } },
        scales: {
          x: { ticks: { font: { size: 10 } }, grid: { display: false } },
          y: { min: 0, ticks: { font: { size: 10 } }, grid: { color: '#f0f4f8' }, title: { display: true, text: 'т CO₂e', font: { size: 10 } } },
        },
      },
    });

    return () => { chart.current?.destroy(); };
  }, [t]);

  const scenarios = [
    { label: t.forecast.bau,      value: t.forecast.bauVal,      sub: t.forecast.bauSub,      icon: '📉', red: true  },
    { label: t.forecast.target,   value: t.forecast.targetVal,   sub: t.forecast.targetSub,   icon: '🎯', red: false },
    { label: t.forecast.measures, value: t.forecast.measuresVal, sub: t.forecast.measuresSub, icon: '⚙️', red: false },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>{t.forecast.title}</div>
        <div style={{ fontSize: 13, color: '#7a9ab0' }}>{t.forecast.subtitle}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {scenarios.map(s => (
          <div key={s.label} style={{ ...card, borderTop: `3px solid ${s.red ? '#f4a9a8' : '#7EC8C8'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#7a9ab0', fontWeight: 500, maxWidth: '80%', lineHeight: 1.4 }}>{s.label}</div>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1a2332', marginBottom: 6 }}>{s.value}</div>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: s.red ? '#c0392b' : '#5aabb0',
              background: s.red ? '#fdecea' : '#e8f7f7',
              padding: '3px 10px', borderRadius: 20, display: 'inline-block',
            }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', marginBottom: 16 }}>{t.forecast.chart}</div>
        <div style={{ position: 'relative', height: 340 }}><canvas ref={chartRef} /></div>
      </div>
    </div>
  );
}