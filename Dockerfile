# Dockerfile para Kanban Project Management Tool
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto 5173
EXPOSE 5173

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]