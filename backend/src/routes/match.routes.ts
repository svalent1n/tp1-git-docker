/**
 * Rutas de Partidos
 * -----------------
 * Define los endpoints del fixture y su política de seguridad:
 *   - Lectura (GET): pública, cualquiera puede consultar el fixture.
 *   - Escritura (POST/PATCH/DELETE): requiere estar autenticado y ser admin.
 */

import { Router } from "express";
import { matchController } from "../controllers/match.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// --- Endpoints públicos (solo lectura) ---
router.get("/", matchController.list);
router.get("/:id", matchController.getById);

// --- Endpoints protegidos (requieren login + rol admin) ---
router.post("/", authenticate, authorize("admin"), matchController.create);
router.patch("/:id/result", authenticate, authorize("admin"), matchController.setResult);
router.delete("/:id", authenticate, authorize("admin"), matchController.remove);

export default router;
