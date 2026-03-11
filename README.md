# Carbon-Footprint-Dashboard
Carbon Footprint Dashboard
Веб-дашборд для визуализации углеродного следа университета. Проект находится в стадии разработки — данные будут подключены позднее, на данный момент реализованы интерфейс и расчётные функции.

Технологический стек

React 18 + TypeScript
Recharts
Tailwind CSS
React Router v6


Структура проекта
carbon-dashboard/
├── src/
│   ├── components/
│   │   ├── charts/        # Графики (LineChart, BarChart, PieChart, RadarChart)
│   │   ├── filters/       # Фильтры по году, зданию, периоду
│   │   ├── kpi/           # KPI-карточки
│   │   └── layout/        # Header, Sidebar, Layout
│   ├── pages/
│   │   ├── Overview.tsx   # Главная — ключевые показатели
│   │   ├── Electricity.tsx
│   │   ├── Emissions.tsx
│   │   ├── Buildings.tsx
│   │   ├── Forecast.tsx
│   │   └── About.tsx
│   ├── data/
│   │   └── mockData.ts    # Временные данные-заглушки
│   ├── hooks/
│   │   └── useFilters.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── calculations.ts  # Расчёт выбросов, коэффициенты, прогноз
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── tailwind.config.js
