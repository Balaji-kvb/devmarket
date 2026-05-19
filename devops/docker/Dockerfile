# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Environment variables
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000

# Build Next.js application
RUN npm run build

# ==========================================
# Production Runner
# ==========================================

FROM node:20-alpine AS runner

WORKDIR /app

# Create app user
RUN addgroup -S devmarket && adduser -S app -G devmarket

# Copy standalone build
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Permissions
RUN chown -R app:devmarket /app

USER app

# Runtime environment
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start application
CMD ["node", "server.js"]