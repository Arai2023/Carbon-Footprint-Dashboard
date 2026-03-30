import * as XLSX from 'xlsx';
import { DashboardData } from '../context/DataContext';

// Ожидаемый формат Excel:
// Лист "Электроэнергия": колонки Месяц, 2021, 2022, 2023
// Лист "Здания": колонки Название, кВтч, Площадь, Зелёное(1/0)
// Лист "Выбросы": колонки Год, Scope1, Scope2
// Лист "KPI": колонки Показатель, Значение

export async function parseExcelFile(file: File): Promise<Partial<DashboardData>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const result: Partial<DashboardData> = {};

        // Лист "Электроэнергия"
        if (workbook.SheetNames.includes('Электроэнергия')) {
          const ws = workbook.Sheets['Электроэнергия'];
          const rows = XLSX.utils.sheet_to_json<Record<string, number>>(ws);
          const elec: Record<number, number[]> = { 2021: [], 2022: [], 2023: [] };
          rows.forEach((row) => {
            if (row['2021'] !== undefined) elec[2021].push(Number(row['2021']));
            if (row['2022'] !== undefined) elec[2022].push(Number(row['2022']));
            if (row['2023'] !== undefined) elec[2023].push(Number(row['2023']));
          });
          if (elec[2023].length > 0) result.electricity = elec;
        }

        // Лист "Здания"
        if (workbook.SheetNames.includes('Здания')) {
          const ws = workbook.Sheets['Здания'];
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
          result.buildings = rows.map((row) => ({
            name:  String(row['Название'] ?? ''),
            kwh:   Number(row['кВтч'] ?? 0),
            area:  Number(row['Площадь'] ?? 0),
            green: Number(row['Зелёное'] ?? 0) === 1,
          }));
        }

        // Лист "Выбросы"
        if (workbook.SheetNames.includes('Выбросы')) {
          const ws = workbook.Sheets['Выбросы'];
          const rows = XLSX.utils.sheet_to_json<Record<string, number>>(ws);
          result.emissions = {
            scope1: rows.map((r) => Number(r['Scope1'] ?? 0)),
            scope2: rows.map((r) => Number(r['Scope2'] ?? 0)),
          };
        }

        // Лист "KPI"
        if (workbook.SheetNames.includes('KPI')) {
          const ws = workbook.Sheets['KPI'];
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
          const kpiMap: Record<string, number> = {};
          rows.forEach((r) => {
            kpiMap[String(r['Показатель'])] = Number(r['Значение']);
          });
          result.kpi = {
            totalCO2:       kpiMap['totalCO2']       ?? 4820,
            co2PerStudent:  kpiMap['co2PerStudent']  ?? 0.96,
            co2PerSqm:      kpiMap['co2PerSqm']      ?? 38.6,
            students:       kpiMap['students']        ?? 5020,
            totalKwh:       kpiMap['totalKwh']        ?? 8214,
          };
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsArrayBuffer(file);
  });
}

// Генерация шаблона Excel для скачивания
export function generateExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // Лист Электроэнергия
  const elecData = [
    ['Месяц', '2021', '2022', '2023'],
    ['Янв', 980, 950, 912],
    ['Фев', 920, 890, 845],
    ['Мар', 850, 820, 780],
    ['Апр', 710, 680, 640],
    ['Май', 640, 610, 580],
    ['Июн', 570, 545, 510],
    ['Июл', 545, 520, 490],
    ['Авг', 580, 550, 520],
    ['Сен', 730, 700, 660],
    ['Окт', 850, 820, 780],
    ['Ноя', 940, 910, 870],
    ['Дек', 700, 668, 627],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(elecData), 'Электроэнергия');

  // Лист Здания
  const bldData = [
    ['Название', 'кВтч', 'Площадь', 'Зелёное'],
    ['Толе би',        1820, 5200, 0],
    ['Панфилова',      1540, 4800, 0],
    ['Абылай хана',    1280, 4200, 0],
    ['Библиотека',      860, 2400, 1],
    ['Цокольный этаж',  740, 1200, 0],
    ['5 этаж',          620, 1100, 1],
    ['Столовая',        510,  800, 1],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bldData), 'Здания');

  // Лист Выбросы
  const emData = [
    ['Год', 'Scope1', 'Scope2'],
    ['2019', 2210, 2890],
    ['2020', 2050, 2650],
    ['2021', 1980, 2580],
    ['2022', 1630, 2510],
    ['2023', 1418, 2402],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(emData), 'Выбросы');

  // Лист KPI
  const kpiData = [
    ['Показатель', 'Значение'],
    ['totalCO2',      4820],
    ['co2PerStudent',  0.96],
    ['co2PerSqm',     38.6],
    ['students',      5020],
    ['totalKwh',      8214],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpiData), 'KPI');

  XLSX.writeFile(wb, 'carbon_data_template.xlsx');
}
