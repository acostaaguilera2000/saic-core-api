/**
 * @file authRoutes.js
 * @description Definición de endpoints semánticos para el proceso de autenticación REST.
 */
import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

// Rutas puras de consumo API
router.post("/login", AuthController.processLogin);
router.post("/logout", AuthController.processLogout);

export default router;