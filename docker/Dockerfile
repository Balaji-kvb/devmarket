# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npx prisma generate

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S devmarket && adduser -S app -G devmarket

COPY --from=builder /app/.next/standalone/package.json ./
RUN npm install --production

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R app:devmarket /app
USER app

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
CMD ["node", "server.js"]
