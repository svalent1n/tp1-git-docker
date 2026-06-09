/**
 * Rutas de Autenticación
 * ----------------------
 * Endpoints públicos para registrarse e iniciar sesión, y un endpoint protegido
 * (`/me`) que devuelve los datos del usuario logueado a partir de su token.
 */

import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

export default router;
