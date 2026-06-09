/**
 * Middleware de Autenticación y Autorización
 * ------------------------------------------
 * - `authenticate`: exige un token JWT válido en el header Authorization.
 *   Si es válido, adjunta los datos del usuario a `req.user` y deja pasar.
 * - `authorize`: exige que el usuario autenticado tenga uno de los roles dados.
 *
 * Separar autenticación (¿quién sos?) de autorización (¿qué podés hacer?)
 * mantiene la seguridad clara y reutilizable en cualquier ruta.
 */

import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { AuthPayload, Role } from "../domain/types";
import { Errors } from "../domain/errors";

// Extendemos el tipo Request de Express para incluir el usuario autenticado.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/** Verifica el token "Bearer <token>" del header Authorization. */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(Errors.unauthorized("Falta el token de autenticación"));
  }
  const token = header.substring("Bearer ".length);
  req.user = authService.verifyToken(token); // lanza 401 si es inválido
  next();
}

/** Permite el acceso solo a usuarios con alguno de los roles indicados. */
export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(Errors.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(Errors.forbidden());
    }
    next();
  };
}
