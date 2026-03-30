import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData, DashboardData, BuildingRow } from '../../context/DataContext';
import { parseExcelFile, generateExcelTemplate } from '../../utils/excelParser';
import { MONTHS } from '../../data/mockData';

type Tab = 'overview' | 'electricity' | 'buildings' | 'emissions' | 'kpi' | 'excel';

const GREEN = '#1A7F4B';
const LIGHT = '#f0faf5';

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', marginBottom: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: LIGHT, borderRadius: 8, padding: '10px 14px', flex: 1 }}>
      <div style={{ fontSize: 10, color: '#7a9ab0', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: GREEN }}>{value}</div>
    </div>
  );
}

export default function AdminPage({ onNavigate }: { onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const { data, setData, resetData } = useData();
  const [tab, setTab] = useState<Tab>('overview');
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Local editable copies
  const [elec, setElec] = useState(() => ({
    2021: [...data.electricity[2021]],
    2022: [...data.electricity[2022]],
    2023: [...data.electricity[2023]],
  }));
  const [buildings, setBuildings] = useState<BuildingRow[]>(() => data.buildings.map(b => ({ ...b })));
  const [emissions, setEmissions] = useState(() => ({
    scope1: [...data.emissions.scope1],
    scope2: [...data.emissions.scope2],
  }));
  const [kpi, setKpi] = useState(() => ({ ...data.kpi }));

  const saveAll = () => {
    const newData: DashboardData = {
      electricity: { 2021: elec[2021], 2022: elec[2022], 2023: elec[2023] },
      buildings,
      emissions,
      kpi,
    };
    setData(newData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!confirm('Сбросить все данные к исходным значениям?')) return;
    resetData();
    window.location.reload();
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg('');
    try {
      const parsed = await parseExcelFile(file);
      const newData: DashboardData = {
        electricity: parsed.electricity ?? data.electricity,
        buildings:   parsed.buildings   ?? data.buildings,
        emissions:   parsed.emissions   ?? data.emissions,
        kpi:         parsed.kpi         ?? data.kpi,
      };
      setData(newData);
      setElec({ 2021: [...newData.electricity[2021]], 2022: [...newData.electricity[2022]], 2023: [...newData.electricity[2023]] });
      setBuildings(newData.buildings.map(b => ({ ...b })));
      setEmissions({ scope1: [...newData.emissions.scope1], scope2: [...newData.emissions.scope2] });
      setKpi({ ...newData.kpi });
      setUploadMsg('✓ Данные успешно загружены из Excel');
    } catch {
      setUploadMsg('✗ Ошибка чтения файла. Убедитесь что формат совпадает с шаблоном.');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview',     label: 'Обзор' },
    { id: 'electricity',  label: 'Электроэнергия' },
    { id: 'buildings',    label: 'Здания' },
    { id: 'emissions',    label: 'Выбросы' },
    { id: 'kpi',          label: 'KPI' },
    { id: 'excel',        label: 'Excel' },
  ];

  const inp = (val: number, onChange: (v: number) => void) => (
    <input
      type="number"
      value={val}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: 70, padding: '4px 6px', border: '1px solid #ddd', borderRadius: 6, fontSize: 12, textAlign: 'center' }}
    />
  );

  const thS = { padding: '8px 10px', background: '#f8f8f8', fontSize: 11, color: '#7a9ab0', fontWeight: 600, borderBottom: '1px solid #eee', textAlign: 'left' as const };
  const tdS = { padding: '7px 10px', borderBottom: '1px solid #f5f5f5', fontSize: 12 };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f4', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ width: 28, height: 28, background: GREEN, borderRadius: '50% 0 50% 0', flexShrink: 0 }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>Админ панель</div>
        <div style={{ fontSize: 12, color: '#7a9ab0', flex: 1 }}>Carbon Dashboard · КБТУ</div>

        <button onClick={onNavigate} style={{ fontSize: 12, padding: '6px 14px', border: '1px solid #ddd', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: '#555' }}>
          ← На сайт
        </button>
        <div style={{ fontSize: 12, color: '#7a9ab0' }}>{user?.username} ({user?.role})</div>
        <button onClick={logout} style={{ fontSize: 12, padding: '6px 14px', border: '1px solid #fcc', borderRadius: 8, background: '#fff5f5', cursor: 'pointer', color: '#c0392b' }}>
          Выйти
        </button>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', padding: 6, borderRadius: 10, border: '1px solid #e5e5e5', width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 16px', fontSize: 13, border: 'none', borderRadius: 7, cursor: 'pointer',
              background: tab === t.id ? GREEN : 'transparent',
              color: tab === t.id ? '#fff' : '#555',
              fontWeight: tab === t.id ? 600 : 400,
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            <SectionCard title="Текущие данные">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <StatBadge label="Общий CO₂e" value={`${data.kpi.totalCO2} т`} />
                <StatBadge label="Студентов" value={data.kpi.students} />
                <StatBadge label="CO₂e / студент" value={`${data.kpi.co2PerStudent} т`} />
                <StatBadge label="Зданий" value={data.buildings.length} />
                <StatBadge label="Электро 2023" value={`${data.electricity[2023].reduce((a,b)=>a+b,0)} МВтч`} />
              </div>
            </SectionCard>
            <SectionCard title="Действия">
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={saveAll} style={{ padding: '10px 20px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  💾 Сохранить все изменения
                </button>
                <button onClick={handleReset} style={{ padding: '10px 20px', background: '#fdecea', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                  🔄 Сбросить к исходным
                </button>
              </div>
              {saved && <div style={{ marginTop: 12, color: GREEN, fontSize: 13, fontWeight: 500 }}>✓ Данные сохранены</div>}
            </SectionCard>
          </>
        )}

        {/* ELECTRICITY */}
        {tab === 'electricity' && (
          <SectionCard title="Потребление электроэнергии по месяцам (МВтч)">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead>
                  <tr>
                    <th style={thS}>Месяц</th>
                    <th style={thS}>2021</th>
                    <th style={thS}>2022</th>
                    <th style={thS}>2023</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.map((m, i) => (
                    <tr key={m}>
                      <td style={{ ...tdS, fontWeight: 500, color: '#333' }}>{m}</td>
                      <td style={tdS}>{inp(elec[2021][i], v => setElec(prev => { const a = [...prev[2021]]; a[i] = v; return { ...prev, 2021: a }; }))}</td>
                      <td style={tdS}>{inp(elec[2022][i], v => setElec(prev => { const a = [...prev[2022]]; a[i] = v; return { ...prev, 2022: a }; }))}</td>
                      <td style={tdS}>{inp(elec[2023][i], v => setElec(prev => { const a = [...prev[2023]]; a[i] = v; return { ...prev, 2023: a }; }))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={saveAll} style={{ marginTop: 16, padding: '9px 20px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              💾 Сохранить
            </button>
            {saved && <span style={{ marginLeft: 12, color: GREEN, fontSize: 13 }}>✓ Сохранено</span>}
          </SectionCard>
        )}

        {/* BUILDINGS */}
        {tab === 'buildings' && (
          <SectionCard title="Данные по зданиям">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thS}>Название</th>
                    <th style={thS}>кВтч</th>
                    <th style={thS}>Площадь м²</th>
                    <th style={thS}>Зелёное</th>
                  </tr>
                </thead>
                <tbody>
                  {buildings.map((b, i) => (
                    <tr key={i}>
                      <td style={tdS}>
                        <input value={b.name} onChange={e => setBuildings(prev => { const a = [...prev]; a[i] = { ...a[i], name: e.target.value }; return a; })}
                          style={{ width: 150, padding: '4px 8px', border: '1px solid #ddd', borderRadius: 6, fontSize: 12 }} />
                      </td>
                      <td style={tdS}>{inp(b.kwh, v => setBuildings(prev => { const a = [...prev]; a[i] = { ...a[i], kwh: v }; return a; }))}</td>
                      <td style={tdS}>{inp(b.area, v => setBuildings(prev => { const a = [...prev]; a[i] = { ...a[i], area: v }; return a; }))}</td>
                      <td style={tdS}>
                        <input type="checkbox" checked={b.green} onChange={e => setBuildings(prev => { const a = [...prev]; a[i] = { ...a[i], green: e.target.checked }; return a; })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button onClick={() => setBuildings(prev => [...prev, { name: 'Новое здание', kwh: 0, area: 0, green: false }])}
                style={{ padding: '8px 16px', background: '#e8f7f7', color: '#1a7f7f', border: '1px solid #b2dfdf', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                + Добавить здание
              </button>
              <button onClick={saveAll} style={{ padding: '8px 16px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                💾 Сохранить
              </button>
              {saved && <span style={{ alignSelf: 'center', color: GREEN, fontSize: 13 }}>✓ Сохранено</span>}
            </div>
          </SectionCard>
        )}

        {/* EMISSIONS */}
        {tab === 'emissions' && (
          <SectionCard title="Выбросы CO₂ по годам (т CO₂e)">
            <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: 500 }}>
              <thead>
                <tr>
                  <th style={thS}>Год</th>
                  <th style={thS}>Scope 1 (газ/тепло)</th>
                  <th style={thS}>Scope 2 (электро)</th>
                </tr>
              </thead>
              <tbody>
                {['2019','2020','2021','2022','2023'].map((yr, i) => (
                  <tr key={yr}>
                    <td style={{ ...tdS, fontWeight: 500 }}>{yr}</td>
                    <td style={tdS}>{inp(emissions.scope1[i], v => setEmissions(prev => { const a = [...prev.scope1]; a[i] = v; return { ...prev, scope1: a }; }))}</td>
                    <td style={tdS}>{inp(emissions.scope2[i], v => setEmissions(prev => { const a = [...prev.scope2]; a[i] = v; return { ...prev, scope2: a }; }))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={saveAll} style={{ marginTop: 16, padding: '9px 20px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              💾 Сохранить
            </button>
            {saved && <span style={{ marginLeft: 12, color: GREEN, fontSize: 13 }}>✓ Сохранено</span>}
          </SectionCard>
        )}

        {/* KPI */}
        {tab === 'kpi' && (
          <SectionCard title="Ключевые показатели">
            {([
              { key: 'totalCO2',      label: 'Общий CO₂e (т)',       step: 1   },
              { key: 'co2PerStudent', label: 'CO₂e на студента (т)',  step: 0.01 },
              { key: 'co2PerSqm',    label: 'CO₂e на м² (кг)',       step: 0.1 },
              { key: 'students',     label: 'Количество студентов',   step: 1   },
              { key: 'totalKwh',     label: 'Итого электро (МВтч)',   step: 1   },
            ] as const).map(({ key, label, step }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 220, fontSize: 13, color: '#444' }}>{label}</div>
                <input
                  type="number"
                  step={step}
                  value={kpi[key]}
                  onChange={e => setKpi(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  style={{ width: 120, padding: '7px 10px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13 }}
                />
              </div>
            ))}
            <button onClick={saveAll} style={{ marginTop: 8, padding: '9px 20px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              💾 Сохранить
            </button>
            {saved && <span style={{ marginLeft: 12, color: GREEN, fontSize: 13 }}>✓ Сохранено</span>}
          </SectionCard>
        )}

        {/* EXCEL */}
        {tab === 'excel' && (
          <>
            <SectionCard title="Загрузка данных из Excel">
              <div style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.7 }}>
                Загрузи Excel-файл в формате шаблона. Данные обновятся мгновенно и сохранятся в браузере.
                Файл должен содержать листы: <strong>Электроэнергия</strong>, <strong>Здания</strong>, <strong>Выбросы</strong>, <strong>KPI</strong>.
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={generateExcelTemplate} style={{ padding: '10px 18px', background: '#e8f7f7', color: '#1a7f7f', border: '1px solid #b2dfdf', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                  📥 Скачать шаблон Excel
                </button>
                <label style={{ padding: '10px 18px', background: GREEN, color: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  📂 {uploading ? 'Загружаем...' : 'Загрузить файл'}
                  <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} style={{ display: 'none' }} />
                </label>
              </div>
              {uploadMsg && (
                <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, fontSize: 13,
                  background: uploadMsg.startsWith('✓') ? '#e8f5ee' : '#fdecea',
                  color: uploadMsg.startsWith('✓') ? GREEN : '#c0392b' }}>
                  {uploadMsg}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Структура шаблона">
              {[
                { sheet: 'Электроэнергия', cols: 'Месяц | 2021 | 2022 | 2023', rows: '12 строк (по одной на каждый месяц)' },
                { sheet: 'Здания',         cols: 'Название | кВтч | Площадь | Зелёное (1 или 0)', rows: 'По одной строке на здание' },
                { sheet: 'Выбросы',        cols: 'Год | Scope1 | Scope2', rows: '5 строк (2019–2023)' },
                { sheet: 'KPI',            cols: 'Показатель | Значение', rows: '5 строк (totalCO2, co2PerStudent, co2PerSqm, students, totalKwh)' },
              ].map(s => (
                <div key={s.sheet} style={{ marginBottom: 12, padding: '10px 14px', background: LIGHT, borderRadius: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: GREEN, marginBottom: 4 }}>Лист «{s.sheet}»</div>
                  <div style={{ fontSize: 12, color: '#555' }}>Колонки: {s.cols}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{s.rows}</div>
                </div>
              ))}
            </SectionCard>
          </>
        )}
      </div>
    </div>
  );
}
