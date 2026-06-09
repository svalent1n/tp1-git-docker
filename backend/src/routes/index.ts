/**
 * Enrutador principal
 * -------------------
 * Agrupa todos los routers de la API bajo un único punto de montaje. Si mañana
 * se agregan más recursos (equipos, estadios, etc.), se registran aquí.
 */

import { Router } from "express";
import matchRoutes from "./match.routes";
import authRoutes from "./auth.routes";

const router = Router();

// Endpoint de salud: permite verificar que la API está viva (healthcheck).
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/matches", matchRoutes);

export default router;
