/**
 * @file ministryRoutes.js
 * @description Rutas bajo el estándar RESTful para la administración de ministerios y membresías.
 */
import express from "express";
import MinistryController from "../controllers/MinistryController.js";
import {
    validateMinistryCreate,
    validateMinistryUpdate,
    validateMinistryMemberAction
} from "../middlewares/validate-modules/ministryValidation.js";

const router = express.Router();

// Operaciones base de la colección de ministerios
router.get("/", MinistryController.getAllMinistries);
router.post("/", validateMinistryCreate, MinistryController.processCreateMinistry);

// Operaciones de instancias de un ministerio específico
router.get("/:id", MinistryController.getMinistryDetails);
router.put("/:id", validateMinistryUpdate, MinistryController.processUpdateMinistry);

// Gestión RESTful de un sub-recurso: Miembros asignados a un ministerio
router.post("/:id/members/:memberId", validateMinistryMemberAction, MinistryController.processAddMember);
router.delete("/:id/members/:memberId", validateMinistryMemberAction, MinistryController.processRemoveMember);

export default router;