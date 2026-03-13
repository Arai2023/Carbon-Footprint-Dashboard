export const MONTHS = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
export const YEARS = ['2019','2020','2021','2022','2023'];

export const CO2_COEFFICIENT = 0.514; // кг CO₂e per kWh (Казахстан 2023)
export const HEAT_COEFFICIENT = 0.202;

export const electricity = {
  2021: [980,920,850,710,640,570,545,580,730,850,940,700],
  2022: [950,890,820,680,610,545,520,550,700,820,910,668],
  2023: [912,845,780,640,580,510,490,520,660,780,870,627],
};

export const buildings = [
  { name: 'Корпус A',      kwh: 1820, area: 4200, green: false },
  { name: 'Корпус B',      kwh: 1540, area: 3800, green: false },
  { name: 'Корпус C',      kwh: 1280, area: 3200, green: false },
  { name: 'Серверная',     kwh: 980,  area: 400,  green: false },
  { name: 'Лаборатория',   kwh: 860,  area: 1200, green: false },
  { name: 'Корпус D',      kwh: 740,  area: 2800, green: true  },
  { name: 'Столовая',      kwh: 620,  area: 900,  green: true  },
  { name: 'Корпус E',      kwh: 510,  area: 2600, green: true  },
  { name: 'Общежитие 1',   kwh: 420,  area: 1800, green: true  },
  { name: 'Библиотека',    kwh: 380,  area: 1400, green: true  },
];

export const emissions = {
  scope1: [2210, 2050, 1980, 1630, 1418],
  scope2: [2890, 2650, 2580, 2510, 2402],
};

export const forecast = {
  historical: { years: YEARS, data: [5100, 4700, 4560, 4515, 4820] },
  future: {
    years: ['2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035'],
    bau:     [4750,4680,4610,4545,4480,4420,4360,4300,4245,4190,4135,4080],
    target:  [4600,4380,4160,3950,3740,3540,3370,3280,3190,3100,3010,2920],
    measures:[4500,4150,3800,3450,3120,2800,2490,2200,1930,1680,1450,1240],
  },
};

export const kpi = {
  totalCO2: 4820,
  co2PerStudent: 0.96,
  co2PerSqm: 38.6,
  students: 5020,
  totalKwh: 8214,
};
