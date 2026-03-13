// Линейная экстраполяция (метод наименьших квадратов)
export function linearForecast(data: number[], steps: number): number[] {
  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;

  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (data[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den !== 0 ? num / den : 0;
  const intercept = yMean - slope * xMean;

  return Array.from({ length: steps }, (_, i) =>
    Math.round(intercept + slope * (n + i))
  );
}

export function treeEquivalent(tCO2: number): number {
  return Math.round(tCO2 * 1000 / 20);
}

export function evKmEquivalent(tCO2: number): number {
  return Math.round((tCO2 * 1000) / (0.25 * 0.514));
}

export function flightEquivalent(tCO2: number): number {
  // Алматы-Москва ~1.4 т CO₂ на рейс (туда-обратно)
  return Math.round(tCO2 / 4.62);
}
