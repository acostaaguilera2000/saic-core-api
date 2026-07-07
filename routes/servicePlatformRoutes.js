/**
 * @file servicePlatformRoutes.js
 * @description Enrutamiento semántico para el control de la agenda y plataforma de servicios.
 */
import { Router } from "express";
import ServicePlatformController from "../controllers/ServicePlatformController.js";
import { validateServicePlatform } from "../middlewares/validate-modules/servicePlatformValidator.js";

const router = Router();

// Endpoints base para /api/service (Configurados en app.js)
router.get("/", ServicePlatformController.getAllServices);
router.post("/", validateServicePlatform, ServicePlatformController.processCreateService);

// Cronograma de cultos a partir de la fecha actual
router.get("/schedule", ServicePlatformController.getAllSchedule);

// Operaciones específicas sobre un culto por su identificador único ID
router.get("/:id", ServicePlatformController.getServiceById);
router.put("/:id", validateServicePlatform, ServicePlatformController.processUpdateService);
router.delete("/:id", ServicePlatformController.deleteService);

export default router;