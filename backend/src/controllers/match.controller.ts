/**
 * Capa de Controlador - Partidos
 * ------------------------------
 * Adapta el mundo HTTP (req/res) a la capa de servicio. Su única responsabilidad
 * es leer parámetros/cuerpo, invocar al servicio y devolver la respuesta. Toda la
 * lógica de negocio vive en el servicio; el controlador es deliberadamente fino.
 *
 * Los errores se delegan a `next()` para que el middleware central los procese.
 */

import { NextFunction, Request, Response } from "express";
import { matchService } from "../services/match.service";

export const matchController = {
  /** GET /api/matches  (opcional ?group=A) */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const group = typeof req.query.group === "string" ? req.query.group : undefined;
      res.json(await matchService.list(group));
    } catch (err) {
      next(err);
    }
  },

  /** GET /api/matches/:id */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await matchService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/matches */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await matchService.create(req.body);
      res.status(201).json(match);
    } catch (err) {
      next(err);
    }
  },

  /** PATCH /api/matches/:id/result */
  async setResult(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await matchService.setResult(Number(req.params.id), req.body);
      res.json(match);
    } catch (err) {
      next(err);
    }
  },

  /** DELETE /api/matches/:id */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await matchService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
