/**
 * Capa de Controlador - Autenticación
 * -----------------------------------
 * Expone los endpoints de registro y login. Delega toda la lógica de seguridad
 * en `authService` y nunca devuelve la contraseña ni su hash al cliente.
 */

import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  /** POST /api/auth/register -> crea un usuario común (rol "user"). */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      // Respondemos solo con datos públicos del usuario, jamás el hash.
      res.status(201).json({ id: user.id, username: user.username, role: user.role });
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/auth/login -> valida credenciales y devuelve un token JWT. */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(result); // { token, role }
    } catch (err) {
      next(err);
    }
  },

  /** GET /api/auth/me -> devuelve los datos del usuario autenticado. */
  me(req: Request, res: Response) {
    res.json(req.user);
  },
};
