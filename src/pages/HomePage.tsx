import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { kpi, electricity, MONTHS, CO2_COEFFICIENT } from '../data/mockData';

Chart.register(...registerables);

interface Props { year: string; }

export default function HomePage({ year }: Props) {
  const donutRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const donutChart = useRef<Chart | null>(null);
  const barChart = useRef<Chart | null>(null);

  const selectedYear = year === 'all' ? 2023 : parseInt(year);
  const elecData = electricity[selectedYear as keyof typeof electricity] ?? electricity[2023];
  const co2Monthly = elecData.map(v => Math.round(v * CO2_COEFFICIENT));

  useEffect(() => {
    if (!donutRef.current || !barRef.current) return;
    donutChart.current?.destroy();
    barChart.current?.destroy();

    donutChart.current = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Электроэнергия', 'Теплоснабжение', 'Транспорт', 'Отходы'],
        datasets: [{ data: [52, 31, 12, 5], backgroundColor: ['#1A7F4B','#378ADD','#EF9F27','#888780'], borderWidth: 0, hoverOffset: 6 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { display: false } } },
    });

    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [{ data: co2Monthly, backgroundColor: '#1A7F4B', borderRadius: 3, borderSkipped: false }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font: { size: 10 }, autoSkip: false } },
          y: { ticks: { font: { size: 10 } }, title: { display: true, text: 'т CO₂e', font: { size: 10 } } },
        },
      },
    });

    return () => { donutChart.current?.destroy(); barChart.current?.destroy(); };
  }, [year]);

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Обзор углеродного следа</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Ключевые показатели за {selectedYear} год</div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Общий CO₂e', value: '4 820', unit: 'т', delta: '▼ 6.3% vs 2022', green: true },
          { label: 'CO₂e / студент', value: '0.96', unit: 'т', delta: '▼ 4.1% vs 2022', green: true },
          { label: 'CO₂e / м²', value: '38.6', unit: 'кг', delta: '▼ 5.8% vs 2022', green: true },
          { label: 'Студентов', value: '5 020', unit: '', delta: '+3.2% vs 2022', green: false },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>
              {card.value} <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>{card.unit}</span>
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: card.green ? '#1A7F4B' : '#888' }}>{card.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Источники выбросов</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 11, color: '#666', marginBottom: 10 }}>
            {[['#1A7F4B','Электроэнергия 52%'],['#378ADD','Теплоснабжение 31%'],['#EF9F27','Транспорт 12%'],['#888780','Отходы 5%']].map(([color, label]) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative', height: 200 }}><canvas ref={donutRef} /></div>
        </div>

        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>CO₂e по месяцам ({selectedYear})</div>
          <div style={{ position: 'relative', height: 220 }}><canvas ref={barRef} /></div>
        </div>
      </div>
    </div>
  );
}
