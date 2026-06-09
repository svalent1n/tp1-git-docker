/**
 * Middleware central de manejo de errores
 * ---------------------------------------
 * Captura cualquier error lanzado en controladores o servicios y lo traduce a
 * una respuesta HTTP coherente. Centralizarlo evita repetir try/catch en cada
 * endpoint y garantiza un formato de error uniforme en toda la API.
 */

import { NextFunction, Request, Response } from "express";
import { AppError } from "../domain/errors";

// Express identifica los middlewares de error por tener 4 parámetros.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Errores de dominio conocidos: respondemos con su código y mensaje.
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Errores inesperados: log interno y respuesta genérica (no filtramos detalles).
  console.error("Error inesperado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
}

/** Manejador para rutas no encontradas (404). */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Endpoint no encontrado" });
}
