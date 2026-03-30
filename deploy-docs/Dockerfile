# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package files отдельно для кэширования слоёв
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Копируем исходники и собираем
COPY . .
RUN npm run build

# ─── Stage 2: Production (Nginx) ──────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Копируем собранную статику
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
