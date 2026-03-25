import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  electricity as defaultElectricity,
  buildings as defaultBuildings,
  emissions as defaultEmissions,
  kpi as defaultKpi,
  CO2_COEFFICIENT as defaultCO2Coeff,
  HEAT_COEFFICIENT as defaultHeatCoeff,
} from '../data/mockData';

export interface BuildingRow {
  name: string;
  kwh: number;
  area: number;
  green: boolean;
}

export interface AppData {
  electricity: Record<number, number[]>;
  buildings: BuildingRow[];
  emissions: { scope1: number[]; scope2: number[] };
  kpi: {
    totalCO2: number;
    co2PerStudent: number;
    co2PerSqm: number;
    students: number;
    totalKwh: number;
  };
  co2Coefficient: number;
  heatCoefficient: number;
}

interface DataContextType {
  data: AppData;
  setData: (d: AppData) => void;
  resetData: () => void;
}

const STORAGE_KEY = 'kbtu_carbon_dashboard_data';

const defaultData: AppData = {
  electricity: defaultElectricity,
  buildings: defaultBuildings,
  emissions: defaultEmissions,
  kpi: defaultKpi,
  co2Coefficient: defaultCO2Coeff,
  heatCoefficient: defaultHeatCoeff,
};

/** Load saved data from localStorage, fall back to defaults if missing/corrupt */
function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as AppData;
    // Basic sanity check — make sure key fields exist
    if (!parsed.electricity || !parsed.buildings || !parsed.kpi) return defaultData;
    // Merge: ensure electricity keys are numbers (JSON stringifies them as strings)
    const electricity: Record<number, number[]> = {};
    for (const [k, v] of Object.entries(parsed.electricity)) {
      electricity[parseInt(k)] = v as number[];
    }
    return { ...parsed, electricity };
  } catch {
    return defaultData;
  }
}

const DataContext = createContext<DataContextType>({
  data: defaultData,
  setData: () => {},
  resetData: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AppData>(loadData);

  // Persist every change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage quota exceeded or unavailable — silently ignore
    }
  }, [data]);

  const setData = (d: AppData) => setDataState(d);

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDataState(defaultData);
  };

  return (
    <DataContext.Provider value={{ data, setData, resetData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
