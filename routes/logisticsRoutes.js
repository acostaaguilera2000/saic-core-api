/**
 * @file logisticsRoutes.js
 * @description Enrutamiento RESTful de control logístico de la plataforma.
 */
import { Router } from "express";
import LogisticsController from "../controllers/LogisticsController.js";
import validateLogistics from "../middlewares/validate-modules/validateLogistics.js";

const router = Router();

// Colección general del cronograma de soporte
router.get("/", LogisticsController.getCalendar);

// Recursos específicos por cada culto
router.get("/culto/:idCulto", LogisticsController.getLogisticsByCulto);
router.put("/culto/:idCulto", validateLogistics, LogisticsController.processSaveLogistics);

export default router;