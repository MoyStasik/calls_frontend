# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем package.json
COPY package.json package-lock.json* ./
# Устанавливаем зависимости (используем ci для чистоты)
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Собираем проект
RUN npm run build

# 4. Runner (Production image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# === ВАЖНО: Устанавливаем порт 3001 ===
ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем публичную папку
COPY --from=builder /app/public ./public

# Копируем собранное приложение (режим standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Открываем порт 3001 для Docker
EXPOSE 3001

# Запускаем server.js (который генерируется в standalone режиме)
CMD ["node", "server.js"]
