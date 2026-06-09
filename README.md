# Fixture Mundial 2026 — API REST + Frontend

Trabajo Práctico N.º 1 — **Git y Docker** · Ingeniería de Software
Autor: **Valentín Sánchez**

API REST para gestionar el fixture (partidos) del Mundial 2026, con autenticación
por JWT, persistencia en **MySQL** y un frontend en React para visualizar y
administrar los partidos. Todo el proyecto está dockerizado y orquestado con
Docker Compose.

## Descripción

La aplicación permite **consultar el fixture** de forma pública y **administrarlo**
(crear partidos, cargar resultados y eliminarlos) solo para usuarios autenticados
con rol de administrador.

Se compone de tres servicios:

- **Backend** — API REST en Node.js + TypeScript (Express), con arquitectura en
  capas, seguridad mediante JWT y contraseñas hasheadas con bcrypt.
- **Base de datos** — MySQL 8, accedida desde el backend mediante el driver `mysql2`.
- **Frontend** — Aplicación SPA en React + TypeScript (Vite), servida con Nginx.

## Tecnologías

| Capa          | Tecnologías                                     |
| ------------- | ----------------------------------------------- |
| Backend       | Node.js 20, TypeScript, Express, JWT, bcrypt    |
| Base de datos | MySQL 8 (driver `mysql2`)                       |
| Frontend      | React 18, TypeScript, Vite, Nginx               |
| Contenedores  | Docker, Docker Compose (builds multi-stage)     |
| CI/CD         | GitHub Actions (build + push a Docker Hub)      |

## Inicio rápido

Con Docker Compose se levanta todo el stack (backend, base de datos y frontend) con
un único comando:

```bash
git clone <URL_DEL_REPOSITORIO>
cd tp1-git-docker
docker compose up --build
```

Una vez levantado:

- **Frontend**: http://localhost:8080
- **API**: http://localhost:3000/api/matches

Para detener todo el stack: `docker compose down`

> Las variables de entorno son opcionales para una ejecución local: el `compose`
> trae valores por defecto. Para personalizarlas, ver
> [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

### Ejecución sin Docker (desarrollo)

Requiere Node.js 20+ y una instancia de MySQL accesible (ver
[docs/CONFIGURATION.md](docs/CONFIGURATION.md)).

```bash
# Backend  → http://localhost:3000
cd backend && npm install && npm run dev

# Frontend → http://localhost:5173 (en otra terminal)
cd frontend && npm install && npm run dev
```

## Seguridad

- **Login con JWT**: el cliente obtiene un token al autenticarse y lo envía en el
  header `Authorization: Bearer <token>` en cada petición protegida.
- **Contraseñas hasheadas**: nunca se guardan en texto plano (bcrypt).
- **Roles**: `user` (solo lectura) y `admin` (lectura y escritura).
- **Mensajes de error genéricos** en el login para no revelar si un usuario existe.
- El backend corre en el contenedor como **usuario sin privilegios** (no root).

> El usuario administrador inicial se define mediante las variables `ADMIN_USER` y
> `ADMIN_PASSWORD` (ver [docs/CONFIGURATION.md](docs/CONFIGURATION.md)). Asignales
> valores propios y seguros antes de desplegar en un entorno real.

## CI/CD

El workflow `.github/workflows/ci.yml` compila backend y frontend en cada push y
pull request a `main`. Si el build pasa y es un push a `main`, construye las
imágenes y las publica en Docker Hub. Requiere los secrets `DOCKERHUB_USERNAME` y
`DOCKERHUB_TOKEN` en el repositorio (Settings → Secrets and variables → Actions).

## Documentación

| Documento                                  | Contenido                                          |
| ------------------------------------------ | -------------------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura en capas y estructura del proyecto    |
| [docs/API.md](docs/API.md)                   | Referencia de endpoints y ejemplos de uso          |
| [docs/SEQUENCE.md](docs/SEQUENCE.md)         | Diagrama de secuencia del sistema (SSD)            |
| [docs/CONFIGURATION.md](docs/CONFIGURATION.md) | Variables de entorno y configuración              |
