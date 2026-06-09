/**
 * Ensamblado de la aplicación Express
 * -----------------------------------
 * Construye y configura la app (middlewares, rutas y manejo de errores) pero NO
 * la pone a escuchar. Separar la creación del arranque permite reutilizar la app
 * en tests sin levantar un puerto real.
 */

import express from "express";
import cors from "cors";
import { config } from "./config";
import apiRouter from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();

  // --- Middlewares globales ---
  app.use(cors({ origin: config.corsOrigin })); // habilita el consumo desde el frontend
  app.use(express.json()); // parsea cuerpos JSON

  // --- Rutas de la API (todas bajo /api) ---
  app.use("/api", apiRouter);

  // --- Manejo de errores (siempre al final) ---
  app.use(notFoundHandler); // 404 para rutas inexistentes
  app.use(errorHandler); // traduce errores a respuestas HTTP

  return app;
}
