/**
 * Errores de dominio
 * -------------------
 * Clase de error con código HTTP asociado. Permite que las capas de servicio
 * lancen errores semánticos (ej. "no encontrado", "no autorizado") y que un
 * único middleware central los traduzca a la respuesta HTTP correcta.
 */

export class AppError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}

/** Atajos para los errores más comunes, con su código HTTP correspondiente. */
export const Errors = {
  badRequest: (msg = "Solicitud inválida") => new AppError(400, msg),
  unauthorized: (msg = "No autenticado") => new AppError(401, msg),
  forbidden: (msg = "No tenés permisos para esta acción") => new AppError(403, msg),
  notFound: (msg = "Recurso no encontrado") => new AppError(404, msg),
  conflict: (msg = "El recurso ya existe") => new AppError(409, msg),
};
