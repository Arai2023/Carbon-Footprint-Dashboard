import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { kpi, electricity, MONTHS, CO2_COEFFICIENT } from '../data/mockData';
import { Translations } from '../utils/i18n';

Chart.register(...registerables);

interface Props { year: string; t: Translations; }

const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
};

export default function HomePage({ year, t }: Props) {
  const donutRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const donutChart = useRef<Chart | null>(null);
  const barChart = useRef<Chart | null>(null);

  const selectedYear = year === 'all' ? 2023 : parseInt(year);
  const elecData = electricity[selectedYear] ?? electricity[2023];
  const co2Monthly = elecData.map(v => Math.round(v * CO2_COEFFICIENT));

  useEffect(() => {
    if (!donutRef.current || !barRef.current) return;
    donutChart.current?.destroy();
    barChart.current?.destroy();

    donutChart.current = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Электроэнергия', 'Теплоснабжение', 'Транспорт', 'Отходы'],
        datasets: [{ data: [52, 31, 12, 5], backgroundColor: ['#7EC8C8','#A8C5DA','#B8D4E8','#C9DCE8'], borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10, padding: 12 } } } },
    });

    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [{ data: co2Monthly, backgroundColor: 'rgba(126,200,200,0.7)', borderRadius: 6, hoverBackgroundColor: '#7EC8C8' }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font: { size: 10 } }, grid: { display: false } },
          y: { ticks: { font: { size: 10 } }, grid: { color: '#f0f4f8' }, title: { display: true, text: 'т CO₂e', font: { size: 10 } } },
        },
      },
    });

    return () => { donutChart.current?.destroy(); barChart.current?.destroy(); };
  }, [year]);

  const kpiCards = [
    { label: t.home.totalCO2,   value: kpi.totalCO2.toLocaleString(), unit: 'т',   delta: '▼ 6.3%', green: true,  icon: '🌍' },
    { label: t.home.perStudent, value: kpi.co2PerStudent.toString(),  unit: 'т',   delta: '▼ 4.1%', green: true,  icon: '🎓' },
    { label: t.home.perSqm,     value: kpi.co2PerSqm.toString(),      unit: 'кг',  delta: '▼ 5.8%', green: true,  icon: '🏢' },
    { label: t.home.students,   value: kpi.students.toLocaleString(), unit: '',    delta: '+3.2%',   green: false, icon: '👥' },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #7EC8C8 0%, #A8C5DA 100%)',
        borderRadius: 20, padding: '32px 36px', marginBottom: 24,
        boxShadow: '0 8px 32px rgba(126,200,200,0.3)',
      }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>{t.university}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t.home.title}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{selectedYear} — Казахстан 🇰🇿</div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpiCards.map(c => (
          <div key={c.label} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#7a9ab0', fontWeight: 500 }}>{c.label}</div>
              <span style={{ fontSize: 20 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1a2332' }}>
              {c.value} <span style={{ fontSize: 13, color: '#7a9ab0', fontWeight: 400 }}>{c.unit}</span>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: c.green ? '#5aabb0' : '#f4a9a8',
              background: c.green ? '#e8f7f7' : '#fdecea',
              padding: '3px 8px', borderRadius: 6, alignSelf: 'flex-start',
            }}>{c.delta} vs 2022</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', marginBottom: 16 }}>{t.home.sources}</div>
          <div style={{ position: 'relative', height: 240 }}><canvas ref={donutRef} /></div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', marginBottom: 16 }}>{t.home.monthly} ({selectedYear})</div>
          <div style={{ position: 'relative', height: 240 }}><canvas ref={barRef} /></div>
        </div>
      </div>
    </div>
  );
}