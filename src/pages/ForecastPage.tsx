import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { forecast } from '../data/mockData';

Chart.register(...registerables);

export default function ForecastPage() {
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
            label: 'История',
            data: [...forecast.historical.data, ...nullHist],
            borderColor: '#E24B4A', backgroundColor: 'rgba(226,75,74,0.12)',
            fill: true, tension: 0.35, pointRadius: 4, borderWidth: 2,
          },
          {
            label: 'Business as usual',
            data: [...nullFut, ...forecast.future.bau],
            borderColor: '#888780', borderDash: [5, 3], tension: 0.35,
            pointRadius: 2, borderWidth: 1.5, fill: false,
          },
          {
            label: 'Цель -30% к 2030',
            data: [...nullFut, ...forecast.future.target],
            borderColor: '#378ADD', borderDash: [5, 3], tension: 0.35,
            pointRadius: 2, borderWidth: 1.5, fill: false,
          },
          {
            label: 'С мерами (LED, HVAC)',
            data: [...nullFut, ...forecast.future.measures],
            borderColor: '#1A7F4B', tension: 0.35,
            pointRadius: 2, borderWidth: 2, fill: false,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: {
          x: { ticks: { font: { size: 10 } } },
          y: { min: 0, ticks: { font: { size: 10 } }, title: { display: true, text: 'т CO₂e', font: { size: 10 } } },
        },
      },
    });

    return () => { chart.current?.destroy(); };
  }, []);

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Прогноз снижения выбросов</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Три сценария до 2035 года</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'BAU — год нейтральности', value: 'Не достигнут', sub: 'к 2035', red: true },
          { label: 'Цель -30% к 2030',        value: '~2038',         sub: 'при сохранении темпа', red: false },
          { label: 'С внедрением мер',         value: '~2031',         sub: 'LED + HVAC + датчики',  red: false },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{c.value}</div>
            <div style={{ fontSize: 11, marginTop: 4, color: c.red ? '#c0392b' : '#1A7F4B' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Прогнозные сценарии (т CO₂e)</div>
        <div style={{ position: 'relative', height: 320 }}><canvas ref={chartRef} /></div>
      </div>
    </div>
  );
}
