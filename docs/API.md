# Referencia de la API

Base URL: `http://localhost:3000/api`

## Autenticación

| Método | Endpoint         | Descripción                       | Auth |
| ------ | ---------------- | --------------------------------- | ---- |
| POST   | `/auth/register` | Registra un usuario (rol `user`)  | No   |
| POST   | `/auth/login`    | Devuelve un token JWT             | No   |
| GET    | `/auth/me`       | Datos del usuario autenticado     | Sí   |

## Partidos (fixture)

| Método | Endpoint               | Descripción                       | Auth         |
| ------ | ---------------------- | --------------------------------- | ------------ |
| GET    | `/matches`             | Lista todos los partidos          | No (público) |
| GET    | `/matches?group=A`     | Filtra por grupo                  | No (público) |
| GET    | `/matches/:id`         | Un partido por id                 | No (público) |
| POST   | `/matches`             | Crea un partido                   | admin        |
| PATCH  | `/matches/:id/result`  | Carga el resultado de un partido  | admin        |
| DELETE | `/matches/:id`         | Elimina un partido                | admin        |
| GET    | `/health`              | Healthcheck                       | No           |

## Ejemplo de uso (cURL)

```bash
# 1) Login como admin (devuelve un token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'

# 2) Crear un partido usando el token
curl -X POST http://localhost:3000/api/matches \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"group":"E","homeTeam":"Brasil","awayTeam":"Croacia","stadium":"AT&T Stadium","city":"Dallas","date":"2026-06-14T18:00:00Z"}'
```

> En PowerShell, `curl` apunta a `Invoke-WebRequest` y el escape de comillas es
> distinto. Para enviar JSON conviene usar `Invoke-RestMethod` con el cuerpo entre
> comillas simples:
>
> ```powershell
> Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post `
>   -ContentType "application/json" `
>   -Body '{"username":"admin","password":"admin1234"}'
> ```
