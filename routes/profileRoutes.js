/**
 * @file profileRoutes.js
 * @description Rutas bajo estándar REST para la gestión de datos de cuenta del usuario logueado.
 */
import express from "express";
import ProfileController from "../controllers/ProfileController.js";
import { validateProfileUpdate } from "../middlewares/validate-modules/validateProfile.js";

const router = express.Router();

router.get("/", ProfileController.getProfile);
router.put("/", validateProfileUpdate, ProfileController.processUpdateProfile);

export default router;