export const MONTHS = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
export const YEARS = ['2021','2022','2023'];

export const CO2_COEFFICIENT = 0.514;
export const HEAT_COEFFICIENT = 0.202;

export const electricity: Record<number, number[]> = {
  2021: [980,920,850,710,640,570,545,580,730,850,940,700],
  2022: [950,890,820,680,610,545,520,550,700,820,910,668],
  2023: [912,845,780,640,580,510,490,520,660,780,870,627],
};

export const buildings = [
  { name: 'Толе би',        kwh: 1820, area: 5200, green: false },
  { name: 'Панфилова',      kwh: 1540, area: 4800, green: false },
  { name: 'Абылай хана',    kwh: 1280, area: 4200, green: false },
  { name: 'Библиотека',     kwh: 860,  area: 2400, green: true  },
  { name: 'Цокольный этаж', kwh: 740,  area: 1200, green: false },
  { name: '5 этаж',         kwh: 620,  area: 1100, green: true  },
  { name: 'Столовая',       kwh: 510,  area: 800,  green: true  },
];

export const emissions = {
  scope1: [2210, 2050, 1980, 1630, 1418],
  scope2: [2890, 2650, 2580, 2510, 2402],
};

export const forecast = {
  historical: { years: YEARS, data: [5100, 4700, 4560] },
  future: {
    years: ['2024','2025','2026','2027','2028','2029','2030'],
    bau:      [4750,4680,4610,4545,4480,4420,4360],
    target:   [4600,4380,4160,3950,3740,3540,3370],
    measures: [4500,4150,3800,3450,3120,2800,2490],
  },
};

export const kpi = {
  totalCO2: 4820,
  co2PerStudent: 0.96,
  co2PerSqm: 38.6,
  students: 5020,
  totalKwh: 8214,
};