# ---- Etapa 1: build ----
# Compilamos la app de React a archivos estáticos con Vite.
FROM node:20-alpine AS build
WORKDIR /app

# La URL de la API se inyecta en tiempo de build como variable de entorno.
# Vite reemplaza import.meta.env.VITE_API_URL por este valor al compilar.
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

# Instalamos dependencias aprovechando la caché de capas.
COPY package*.json ./
RUN npm install

# Copiamos el código y generamos el build de producción (carpeta dist/).
COPY . .
RUN npm run build

# ---- Etapa 2: runtime ----
# Servimos los estáticos con Nginx, una imagen mínima y muy eficiente.
FROM nginx:alpine AS runtime

# Reemplazamos la config por defecto para soportar el ruteo de una SPA.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados al directorio que sirve Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
