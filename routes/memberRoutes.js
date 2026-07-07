/**
 * @file memberRoutes.js
 * @description Definición de endpoints semánticos para el censo y control de miembros.
 */
import express from "express";
import MemberController from "../controllers/MemberController.js";
import { validate, validateMemberUpdate } from "../middlewares/validate-modules/validateMember.js";

const router = express.Router();

// Endpoints base para el recurso /api/members (Configurado en app.js)
router.get("/", MemberController.getAllMembers);
router.post("/", validate, MemberController.processCreateMember);

// Operaciones específicas sobre un miembro mediante su ID
router.get("/:id", MemberController.renderEditForm);
router.put("/:id", validateMemberUpdate, MemberController.processUpdateMember);

// Modificación parcial del estado de activación (Activo/Inactivo)
router.patch("/:id/toggle-status", MemberController.toggleMemberStatus); 

export default router;