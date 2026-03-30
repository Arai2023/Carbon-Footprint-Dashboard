import { createContext, useContext, useState, ReactNode } from 'react';
import { electricity as defaultElectricity, buildings as defaultBuildings, emissions as defaultEmissions, kpi as defaultKpi, CO2_COEFFICIENT as defaultCO2Coeff,
  HEAT_COEFFICIENT as defaultHeatCoeff } from '../data/mockData';

export interface BuildingRow {
  name: string;
  kwh: number;
  area: number;
  green: boolean;
}

export interface DashboardData {
  electricity: Record<number, number[]>;
  buildings: BuildingRow[];
  emissions: { scope1: number[]; scope2: number[] };
  kpi: { totalCO2: number; co2PerStudent: number; co2PerSqm: number; students: number; totalKwh: number };
  co2Coefficient: number;
  heatCoefficient: number;
}

const DEFAULT_DATA: DashboardData = {
  electricity: defaultElectricity,
  buildings: defaultBuildings,
  emissions: defaultEmissions,
  kpi: defaultKpi,
  co2Coefficient: defaultCO2Coeff,
  heatCoefficient: defaultHeatCoeff,
};

interface DataContextType {
  data: DashboardData;
  setData: (data: DashboardData) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<DashboardData>(() => {
    try {
      const saved = localStorage.getItem('carbon_data');
      return saved ? JSON.parse(saved) : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  const setData = (newData: DashboardData) => {
    setDataState(newData);
    localStorage.setItem('carbon_data', JSON.stringify(newData));
  };

  const resetData = () => {
    setDataState(DEFAULT_DATA);
    localStorage.removeItem('carbon_data');
  };

  return (
    <DataContext.Provider value={{ data, setData, resetData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
