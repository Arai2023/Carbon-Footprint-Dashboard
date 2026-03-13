import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { electricity, buildings, MONTHS, CO2_COEFFICIENT } from '../data/mockData';

Chart.register(...registerables);

interface Props { year: string; building: string; }

export default function ElectricityPage({ year, building }: Props) {
  const lineRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const lineChart = useRef<Chart | null>(null);
  const barChart = useRef<Chart | null>(null);

  const filteredBuildings = building === 'all' ? buildings : buildings.filter(b => b.name === building);

  useEffect(() => {
    if (!lineRef.current || !barRef.current) return;
    lineChart.current?.destroy();
    barChart.current?.destroy();

    lineChart.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [
          { label: '2023', data: electricity[2023], borderColor: '#1A7F4B', backgroundColor: 'rgba(26,127,75,0.08)', tension: 0.35, fill: true, pointRadius: 3, borderWidth: 2 },
          { label: '2022', data: electricity[2022], borderColor: '#378ADD', backgroundColor: 'transparent', tension: 0.35, pointRadius: 2, borderDash: [4, 2], borderWidth: 1.5 },
          { label: '2021', data: electricity[2021], borderColor: '#B4B2A9', backgroundColor: 'transparent', tension: 0.35, pointRadius: 2, borderDash: [2, 3], borderWidth: 1.5 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10 } } },
        scales: {
          x: { ticks: { font: { size: 10 }, autoSkip: false } },
          y: { ticks: { font: { size: 10 } }, title: { display: true, text: 'МВтч', font: { size: 10 } } },
        },
      },
    });

    const bldData = filteredBuildings.map(b => b.kwh);
    const bldNames = filteredBuildings.map(b => b.name);
    const bldColors = filteredBuildings.map(b => b.green ? '#1A7F4B' : '#E24B4A');

    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: bldNames,
        datasets: [{ data: bldData, backgroundColor: bldColors, borderRadius: 3, borderSkipped: false }],
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font: { size: 10 } }, title: { display: true, text: 'МВтч', font: { size: 10 } } },
          y: { ticks: { font: { size: 10 } } },
        },
      },
    });

    return () => { lineChart.current?.destroy(); barChart.current?.destroy(); };
  }, [year, building]);

  const totalKwh = filteredBuildings.reduce((s, b) => s + b.kwh, 0);
  const totalCO2 = Math.round(totalKwh * CO2_COEFFICIENT);

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Потребление электроэнергии</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Данные по счётчикам, 2021–2023</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Итого 2023', value: '8 214', unit: 'МВтч' },
          { label: 'Пик (январь)', value: '912', unit: 'МВтч' },
          { label: 'На студента', value: '1 635', unit: 'кВтч' },
          { label: 'Коэфф. CO₂', value: '0.514', unit: 'кг/кВтч' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>{c.value} <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>{c.unit}</span></div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Потребление по месяцам — сравнение годов</div>
        <div style={{ position: 'relative', height: 240 }}><canvas ref={lineRef} /></div>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Топ-10 зданий по потреблению (МВтч, 2023)</div>
        <div style={{ position: 'relative', height: 280 }}><canvas ref={barRef} /></div>
      </div>
    </div>
  );
}
