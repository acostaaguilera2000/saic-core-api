/**
 * @file reportRoutes.js
 * @description Enrutamiento API RESTful para la extracción de métricas e históricos.
 */
import { Router } from "express";
import ReportController from "../controllers/ReportController.js";

const router = Router();

// Endpoint REST: Provee la estructura JSON del reporte de cultos/servicios
// Ejemplo de consumo: GET /api/reports/services?month=07
router.get("/services", ReportController.getServicesReport);

export default router;