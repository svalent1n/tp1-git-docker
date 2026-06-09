# ---- Etapa 1: build ----
# Compilamos el TypeScript a JavaScript en una imagen con todas las dependencias.
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos primero los manifiestos para aprovechar la caché de capas de Docker:
# si no cambian, no se reinstalan dependencias en cada build.
COPY package*.json ./
RUN npm install

# Copiamos el código y compilamos.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Etapa 2: runtime ----
# Imagen final liviana: solo el código compilado y las dependencias de producción.
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Instalamos únicamente las dependencias de producción.
COPY package*.json ./
RUN npm install --omit=dev

# Copiamos el JavaScript ya compilado desde la etapa de build.
COPY --from=build /app/dist ./dist

# Por seguridad, ejecutamos como usuario sin privilegios (no root).
USER node

EXPOSE 3000
CMD ["node", "dist/index.js"]
