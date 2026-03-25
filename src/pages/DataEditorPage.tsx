import { useState } from 'react';
import { useData, BuildingRow } from '../context/DataContext';
import { Translations } from '../utils/i18n';
import { MONTHS } from '../data/mockData';

interface Props { t: Translations; }

const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '20px 24px',
  boxShadow: '0 4px 20px rgba(126,200,200,0.12)',
};

const inputStyle = {
  width: '100%',
  padding: '5px 8px',
  border: '1px solid #dce8f0',
  borderRadius: 6,
  fontSize: 12,
  color: '#1a2332',
  fontFamily: 'Inter, system-ui, sans-serif',
  background: '#f8fbfc',
  boxSizing: 'border-box' as const,
};

const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  color: '#1a2332',
  marginBottom: 4,
};

const sectionSub = {
  fontSize: 12,
  color: '#7a9ab0',
  marginBottom: 16,
};

const thStyle = {
  textAlign: 'left' as const,
  padding: '8px 10px',
  color: '#7a9ab0',
  fontWeight: 600,
  fontSize: 11,
  borderBottom: '2px solid #f0f4f8',
  whiteSpace: 'nowrap' as const,
};

const tdStyle = {
  padding: '6px 8px',
  borderBottom: '1px solid #f0f4f8',
};

export default function DataEditorPage({ t }: Props) {
  const { data, setData, resetData } = useData();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'kpi' | 'electricity' | 'buildings' | 'emissions'>('kpi');

  // Local copies for editing
  const [localKpi, setLocalKpi] = useState({ ...data.kpi });
  const [localCoeff, setLocalCoeff] = useState({ co2: data.co2Coefficient, heat: data.heatCoefficient });
  const [localElec, setLocalElec] = useState<Record<number, number[]>>({
    2021: [...data.electricity[2021]],
    2022: [...data.electricity[2022]],
    2023: [...data.electricity[2023]],
  });
  const [localBuildings, setLocalBuildings] = useState<BuildingRow[]>(
    data.buildings.map(b => ({ ...b }))
  );
  const [localEmissions, setLocalEmissions] = useState({
    scope1: [...data.emissions.scope1],
    scope2: [...data.emissions.scope2],
  });

  const handleSave = () => {
    setData({
      ...data,
      kpi: localKpi,
      co2Coefficient: localCoeff.co2,
      heatCoefficient: localCoeff.heat,
      electricity: localElec,
      buildings: localBuildings,
      emissions: localEmissions,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!window.confirm("Вы уверены? Все изменения будут сброшены до исходных данных.")) return;
    resetData();
    window.location.reload();
  };

  const updateElec = (year: number, monthIdx: number, val: string) => {
    const n = parseFloat(val) || 0;
    setLocalElec(prev => {
      const arr = [...prev[year]];
      arr[monthIdx] = n;
      return { ...prev, [year]: arr };
    });
  };

  const updateBuilding = (i: number, field: keyof BuildingRow, val: string | boolean) => {
    setLocalBuildings(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: typeof val === 'boolean' ? val : (field === 'name' ? val : parseFloat(val as string) || 0) };
      return next;
    });
  };

  const addBuilding = () => {
    setLocalBuildings(prev => [...prev, { name: 'Новое здание', kwh: 0, area: 0, green: false }]);
  };

  const removeBuilding = (i: number) => {
    setLocalBuildings(prev => prev.filter((_, idx) => idx !== i));
  };

  const tabs = [
    { id: 'kpi',         label: '📊 KPI', },
    { id: 'electricity', label: '⚡ Электроэнергия', },
    { id: 'buildings',   label: '🏢 Здания', },
    { id: 'emissions',   label: '🌍 Выбросы', },
  ] as const;

  const emissionYears = ['2019', '2020', '2021', '2022', '2023'];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', marginBottom: 4 }}>
            ✏️ Редактор данных
          </div>
          <div style={{ fontSize: 13, color: '#7a9ab0' }}>
            Изменяйте данные прямо через сайт — всё сразу отразится на дашборде
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && (
            <div style={{
              background: '#e8f7f7', color: '#5aabb0', fontSize: 12, fontWeight: 600,
              padding: '8px 16px', borderRadius: 8, border: '1px solid #b2e0e0',
            }}>
              ✅ Данные сохранены!
            </div>
          )}
          <button onClick={handleReset} style={{
            padding: '9px 18px', borderRadius: 8, border: '1px solid #dce8f0',
            fontSize: 13, background: '#f0f4f8', color: '#7a9ab0', cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            🔄 Сбросить
          </button>
          <button onClick={handleSave} style={{
            padding: '9px 20px', borderRadius: 8, border: 'none',
            fontSize: 13, fontWeight: 600,
            background: 'linear-gradient(135deg, #7EC8C8, #A8C5DA)',
            color: '#fff', cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 4px 12px rgba(126,200,200,0.3)',
          }}>
            💾 Сохранить изменения
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 18px', borderRadius: 10, border: 'none',
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
              background: activeTab === tab.id ? '#e8f7f7' : '#f0f4f8',
              color: activeTab === tab.id ? '#5aabb0' : '#7a9ab0',
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === KPI TAB === */}
      {activeTab === 'kpi' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={card}>
            <div style={sectionTitle}>Ключевые показатели (KPI)</div>
            <div style={sectionSub}>Отображаются на главной странице</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  { label: 'Общий CO₂e (т)', field: 'totalCO2' as const, unit: 'т' },
                  { label: 'CO₂e на студента (т)', field: 'co2PerStudent' as const, unit: 'т' },
                  { label: 'CO₂e на м² (кг)', field: 'co2PerSqm' as const, unit: 'кг' },
                  { label: 'Количество студентов', field: 'students' as const, unit: '' },
                  { label: 'Общее потребление (МВтч)', field: 'totalKwh' as const, unit: 'МВтч' },
                ].map(row => (
                  <tr key={row.field} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#7a9ab0', width: '60%' }}>{row.label}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number"
                          value={localKpi[row.field]}
                          onChange={e => setLocalKpi(prev => ({ ...prev, [row.field]: parseFloat(e.target.value) || 0 }))}
                          style={inputStyle}
                        />
                        {row.unit && <span style={{ fontSize: 11, color: '#7a9ab0', whiteSpace: 'nowrap' }}>{row.unit}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Коэффициенты выбросов</div>
            <div style={sectionSub}>Используются для расчёта CO₂ из потребления</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  { label: 'Коэфф. CO₂ (кг/кВтч)', field: 'co2' as const },
                  { label: 'Коэфф. тепла (кг/кВтч)', field: 'heat' as const },
                ].map(row => (
                  <tr key={row.field} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#7a9ab0', width: '60%' }}>{row.label}</td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        step="0.001"
                        value={localCoeff[row.field]}
                        onChange={e => setLocalCoeff(prev => ({ ...prev, [row.field]: parseFloat(e.target.value) || 0 }))}
                        style={inputStyle}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === ELECTRICITY TAB === */}
      {activeTab === 'electricity' && (
        <div style={card}>
          <div style={sectionTitle}>Потребление электроэнергии по месяцам (МВтч)</div>
          <div style={sectionSub}>Данные за 2021, 2022 и 2023 годы</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 80 }}>Год</th>
                  {MONTHS.map(m => <th key={m} style={thStyle}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {[2021, 2022, 2023].map(year => (
                  <tr key={year}>
                    <td style={{ ...tdStyle, fontWeight: 600, fontSize: 13, color: '#5aabb0' }}>{year}</td>
                    {MONTHS.map((_, mi) => (
                      <td key={mi} style={tdStyle}>
                        <input
                          type="number"
                          value={localElec[year][mi]}
                          onChange={e => updateElec(year, mi, e.target.value)}
                          style={{ ...inputStyle, minWidth: 58 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === BUILDINGS TAB === */}
      {activeTab === 'buildings' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={sectionTitle}>Данные по зданиям</div>
            <button onClick={addBuilding} style={{
              padding: '7px 14px', borderRadius: 8, border: '1px dashed #7EC8C8',
              fontSize: 12, background: '#e8f7f7', color: '#5aabb0',
              cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              + Добавить здание
            </button>
          </div>
          <div style={sectionSub}>Потребление (МВтч), площадь (м²), статус "зелёного" здания</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Название</th>
                  <th style={thStyle}>МВтч</th>
                  <th style={thStyle}>Площадь м²</th>
                  <th style={thStyle}>Зелёное 🌿</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {localBuildings.map((b, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={b.name}
                        onChange={e => updateBuilding(i, 'name', e.target.value)}
                        style={{ ...inputStyle, minWidth: 140 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={b.kwh}
                        onChange={e => updateBuilding(i, 'kwh', e.target.value)}
                        style={{ ...inputStyle, minWidth: 80 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={b.area}
                        onChange={e => updateBuilding(i, 'area', e.target.value)}
                        style={{ ...inputStyle, minWidth: 80 }}
                      />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={b.green}
                        onChange={e => updateBuilding(i, 'green', e.target.checked)}
                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#7EC8C8' }}
                      />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button
                        onClick={() => removeBuilding(i)}
                        style={{
                          padding: '4px 10px', borderRadius: 6, border: '1px solid #fdecea',
                          fontSize: 11, background: '#fdecea', color: '#c0392b',
                          cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === EMISSIONS TAB === */}
      {activeTab === 'emissions' && (
        <div style={card}>
          <div style={sectionTitle}>Выбросы CO₂e по годам (т)</div>
          <div style={sectionSub}>Scope 1 (прямые) и Scope 2 (от электричества), данные за 5 лет</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: 600 }}>
            <thead>
              <tr>
                <th style={thStyle}>Год</th>
                <th style={thStyle}>Scope 1 (т CO₂e)</th>
                <th style={thStyle}>Scope 2 (т CO₂e)</th>
              </tr>
            </thead>
            <tbody>
              {emissionYears.map((yr, i) => (
                <tr key={yr}>
                  <td style={{ ...tdStyle, fontWeight: 600, fontSize: 13, color: '#5aabb0' }}>{yr}</td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={localEmissions.scope1[i]}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setLocalEmissions(prev => {
                          const arr = [...prev.scope1]; arr[i] = val;
                          return { ...prev, scope1: arr };
                        });
                      }}
                      style={{ ...inputStyle, maxWidth: 140 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={localEmissions.scope2[i]}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setLocalEmissions(prev => {
                          const arr = [...prev.scope2]; arr[i] = val;
                          return { ...prev, scope2: arr };
                        });
                      }}
                      style={{ ...inputStyle, maxWidth: 140 }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info note */}
      <div style={{
        marginTop: 20, padding: '12px 16px', borderRadius: 10,
        background: '#f0f4f8', border: '1px solid #dce8f0',
        fontSize: 12, color: '#7a9ab0', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>💡</span>
        <span>
          Нажмите <strong style={{ color: '#5aabb0' }}>«Сохранить изменения»</strong> чтобы применить все правки к дашборду.
          Данные автоматически сохраняются в браузере и не исчезнут при обновлении страницы.
        </span>
      </div>
    </div>
  );
}
