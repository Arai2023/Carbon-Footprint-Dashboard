# 🌱 Carbon Footprint Dashboard

**Визуализация углеродного следа КБТУ**

Интерактивный веб-дашборд для отображения потребления электроэнергии, выбросов CO₂ по корпусам и прогнозирования снижения углеродного следа университета.

---

## 👥 Команда

| Имя | Роль |
|-----|------|
| Истилеуова Арайлым | Frontend, архитектура, дизайн |
| Шуканов Дастан | Данные, расчёты, прогноз, админ-панель |

---

## 🛠 Технологический стек

| Слой | Технология |
|------|------------|
| Frontend | React 18 + TypeScript |
| Графики | Chart.js 4 |
| Сборщик | Vite 5 |
| Мультиязычность | Собственный i18n (RU / KZ / EN) |
| Хранилище | localStorage (браузер) |
| Excel-импорт | SheetJS (xlsx) |
| Экспорт PNG/PDF | html2canvas + jsPDF |
| Контейнеризация | Docker + Nginx |
| CI/CD | GitHub Actions → субдомен |

> **Backend / БД:** проект является статическим SPA. Данные хранятся в `localStorage` браузера. Отдельная БД и сервер не требуются.

---

## ⚙️ Переменные окружения

Скопируй `.env.example` в `.env` и заполни:

```bash
cp .env.example .env
```

| Переменная | Описание | Пример |
|------------|----------|--------|
| `VITE_APP_PORT` | Порт Vite dev-сервера | `5173` |
| `VITE_APP_TITLE` | Заголовок вкладки браузера | `Carbon Dashboard` |
| `VITE_ADMIN_PASSWORD_HASH` | SHA-256 хэш пароля admin (необязательно) | `kbtu2024admin` |
| `NGINX_PORT` | Внешний порт Nginx в Docker | `3041` |

---

## 🚀 Быстрый старт (локально)

### Требования
- Node.js ≥ 18
- npm ≥ 9

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Arai2023/Carbon-Footprint-Dashboard.git
cd Carbon-Footprint-Dashboard

# 2. Установить зависимости
npm install

# 3. Скопировать env
cp .env.example .env

# 4. Запустить dev-сервер
npm run dev
```

Сайт откроется по адресу: **http://localhost:5173**

---

## 🐳 Docker (рекомендуется для деплоя)

```bash
# Собрать образ
docker build -t carbon-dashboard .

# Запустить контейнер
docker run -d \
  --name carbon-dashboard \
  --restart unless-stopped \
  -p 3041:80 \
  carbon-dashboard

# Проверить статус
docker ps | grep carbon-dashboard
curl http://localhost:3041/health
```

Или через Docker Compose:

```bash
docker compose up -d
```

---

## 🌐 Порт и Healthcheck

| Параметр | Значение |
|----------|----------|
| Внешний порт (Docker/Nginx) | **3041** |
| Dev-порт (Vite) | **5173** |
| Healthcheck URL | `GET /health` → `200 OK` |
| Healthcheck интервал | каждые 30 сек |

---

## 📦 Зависимости сервисов

| Сервис | Требуется | Описание |
|--------|-----------|----------|
| Node.js | Только при сборке | Сборка статики через Vite |
| Nginx | В Docker-образе | Раздача статических файлов |
| Redis | ❌ Нет | Не используется |
| PostgreSQL | ❌ Нет | Не используется |
| S3 / CDN | ❌ Нет | Не используется |

---

## 📊 Оценка ресурсов

| Ресурс | Dev (Node) | Prod (Nginx Docker) |
|--------|-----------|---------------------|
| RAM | ~150 МБ | ~20 МБ |
| CPU | ~5–15% при сборке | <1% (статика) |
| Disk | ~250 МБ (node_modules) | ~15 МБ (образ) |
| Сеть | — | ~500 КБ при первой загрузке (gzip) |

---

## 📈 Оценка нагрузки

| Метрика | Значение |
|---------|----------|
| Ожидаемых пользователей | 50–200 (студенты и сотрудники КБТУ) |
| Пиковый RPS | ~10 RPS (Nginx легко держит 1000+) |
| Тип нагрузки | Статические файлы — нагрузка минимальна |
| Сессии | Без серверных сессий (SPA + localStorage) |

---

## 📝 Логи

### Docker
```bash
# Просмотр логов контейнера
docker logs carbon-dashboard

# Следить за логами в реальном времени
docker logs -f carbon-dashboard

# Nginx access log внутри контейнера
docker exec carbon-dashboard tail -f /var/log/nginx/access.log
docker exec carbon-dashboard tail -f /var/log/nginx/error.log
```

### Локально (Vite)
Все логи выводятся напрямую в терминал при `npm run dev`.

---

## 🔄 Инструкция деплоя

### Первый деплой

```bash
# На сервере
git clone https://github.com/Arai2023/Carbon-Footprint-Dashboard.git
cd Carbon-Footprint-Dashboard
cp .env.example .env
# Отредактируй .env если нужно
docker compose up -d --build
```

### Обновление (новая версия)

```bash
git pull origin main
docker compose up -d --build
```

### Перезапуск без пересборки

```bash
docker compose restart
# или
docker restart carbon-dashboard
```

### Остановка

```bash
docker compose down
```

---

## 🔁 Автоматический перезапуск

Контейнер настроен с `restart: unless-stopped` — автоматически поднимается после перезагрузки сервера.

Проверить:
```bash
docker inspect carbon-dashboard | grep RestartPolicy
```

---

## 🔐 Безопасность

- Дашборд публичный (только чтение)
- Админ-панель доступна по кнопке 🔒 в навбаре
- Пароли хранятся только в браузере (localStorage), не передаются на сервер
- Для production рекомендуется сменить пароли в `src/context/AuthContext.tsx`

---

## 📁 Структура проекта

```
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ElectricityPage.tsx
│   │   ├── EmissionsPage.tsx
│   │   ├── BuildingsPage.tsx
│   │   ├── ForecastPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── admin/
│   │       ├── LoginPage.tsx
│   │       └── AdminPage.tsx
│   ├── components/
│   │   └── ExportButtons.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── DataContext.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── utils/
│   │   ├── forecast.ts
│   │   ├── excelParser.ts
│   │   ├── exportUtils.ts
│   │   └── i18n.ts
│   └── App.tsx
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .env.example
└── README.md
```
