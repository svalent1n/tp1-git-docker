# Arquitectura

## Backend en capas

El backend separa responsabilidades en capas, de modo que cada una tiene un único
motivo para cambiar. Esto facilita el mantenimiento, las pruebas y la evolución del
sistema. Un ejemplo concreto: migrar el almacenamiento de un store en memoria a
**MySQL** afectó únicamente a la capa de repositorios; el resto del código no se
enteró del cambio.

```
Cliente HTTP
    │
    ▼
[ Routes ]        Definen los endpoints y la política de seguridad (quién puede qué).
    │
    ▼
[ Middlewares ]   Autenticación (JWT), autorización (roles) y manejo central de errores.
    │
    ▼
[ Controllers ]   Adaptan HTTP (req/res) a llamadas de servicio. Son finos.
    │
    ▼
[ Services ]      Lógica de negocio y validaciones. El corazón de la app.
    │
    ▼
[ Repositories ]  Acceso a datos en MySQL mediante el driver `mysql2`.
    │
    ▼
[ Domain ]        Modelos y tipos del negocio. No dependen de ninguna tecnología.
```

La capa de repositorios es la única que conoce SQL: traduce entre las filas de la
base (snake_case, enteros `0/1`) y el modelo de dominio (camelCase, booleanos).
Como el acceso a MySQL es una operación de entrada/salida, los métodos del
repositorio devuelven promesas y la cadena `repositorio → servicio → controlador`
trabaja con `async/await`.

## Estructura del proyecto

```
tp1-git-docker/
├── backend/                # API REST (Node + TS + Express)
│   ├── src/
│   │   ├── config/         # Variables de entorno y pool de conexión a MySQL
│   │   ├── domain/         # Modelos, tipos y errores del negocio
│   │   ├── repositories/   # Acceso a datos (MySQL)
│   │   ├── services/       # Lógica de negocio y seguridad
│   │   ├── controllers/    # Adaptadores HTTP
│   │   ├── middlewares/    # Auth, roles y manejo de errores
│   │   ├── routes/         # Definición de endpoints
│   │   ├── app.ts          # Ensamblado de Express
│   │   └── index.ts        # Arranque del servidor (init de BD + seeding)
│   ├── Dockerfile          # Build multi-stage
│   └── .env.example
├── frontend/               # SPA (React + TS + Vite)
│   ├── src/
│   │   ├── components/      # Login, MatchForm, MatchList
│   │   ├── api.ts          # Cliente HTTP de la API
│   │   ├── App.tsx         # Componente raíz
│   │   └── main.tsx        # Punto de entrada
│   ├── Dockerfile          # Build multi-stage + Nginx
│   └── nginx.conf
├── docs/                   # Documentación del proyecto
├── docker-compose.yml      # Orquesta backend + frontend + MySQL
├── .github/workflows/ci.yml
├── .gitignore
└── .env.example
```
