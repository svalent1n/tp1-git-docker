# Configuración

Las variables de entorno están documentadas en `.env.example`. Para una ejecución
con Docker Compose no es necesario crear un `.env`: el `docker-compose.yml` define
valores por defecto. Para personalizarlas, copiá el ejemplo y editá los valores:

```bash
cp .env.example .env
```

> El archivo `.env` está en `.gitignore` y **no debe subirse al repositorio**, ya
> que contiene credenciales. Solo se versiona `.env.example`.

## Variables disponibles

| Variable         | Servicio      | Descripción                              | Default                     |
| ---------------- | ------------- | ---------------------------------------- | --------------------------- |
| `PORT`           | backend       | Puerto de la API                         | `3000`                      |
| `CORS_ORIGIN`    | backend       | Origen permitido para CORS               | `*`                         |
| `JWT_SECRET`     | backend       | Secreto para firmar los tokens JWT       | (cambiar en producción)     |
| `JWT_EXPIRES_IN` | backend       | Expiración del token                     | `2h`                        |
| `BCRYPT_ROUNDS`  | backend       | Costo del hasheo de contraseñas          | `10`                        |
| `ADMIN_USER`     | backend       | Usuario admin inicial                    | `admin`                     |
| `ADMIN_PASSWORD` | backend       | Contraseña del admin inicial             | (asignar valor propio)      |
| `DB_HOST`        | backend       | Host de la base de datos                 | `mysql` (Docker)            |
| `DB_PORT`        | backend       | Puerto de la base de datos               | `3306`                      |
| `DB_USER`        | backend       | Usuario de MySQL                         | `root`                      |
| `DB_PASSWORD`    | backend / db  | Contraseña de MySQL                      | (asignar valor propio)      |
| `DB_NAME`        | backend / db  | Nombre de la base de datos               | `mundial`                   |
| `VITE_API_URL`   | frontend      | URL de la API que consume el frontend    | `http://localhost:3000/api` |

## Conexión a la base de datos: Docker vs. local

El valor de `DB_HOST` cambia según dónde corra el backend:

- **Dentro de Docker Compose**, el backend alcanza a la base por el **nombre del
  servicio**: `DB_HOST=mysql` y `DB_PORT=3306` (el puerto interno del contenedor).
- **Fuera de Docker** (ejecución con `npm run dev`), el backend se conecta a la base
  por `localhost` y el puerto que tengas mapeado en tu host (por ejemplo,
  `DB_HOST=localhost` y `DB_PORT=3306`).

La base arranca vacía: el backend crea las tablas al iniciar (`initDb`) y siembra el
usuario admin y unos partidos de ejemplo solo si las tablas están vacías. El seeding
es idempotente, así que reiniciar el proceso no duplica datos.

## Publicación de imágenes (Docker Hub)

Las imágenes se publican automáticamente vía GitHub Actions al hacer push a `main`.
Para hacerlo de forma manual:

```bash
# Backend
docker build -t <usuario>/mundial-backend:latest ./backend
docker push <usuario>/mundial-backend:latest

# Frontend
docker build -t <usuario>/mundial-frontend:latest ./frontend
docker push <usuario>/mundial-frontend:latest
```
