# Dockerfile para Kanban Project Management Tool (preparado para Fly.io)
FROM node:20-alpine AS builder

# Directorio base
WORKDIR /app

# Dependencias y build
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

# Código fuente
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Solo copiar los artefactos necesarios de la etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer el puerto que Fly asignará (dentro del contenedor)
EXPOSE 4173

# Ejecutar el preview en el puerto que le da Fly (o 4173 por defecto local)
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT:-4173}"]