/**
 * @file userRoutes.js
 * @description Definición de endpoints RESTful para la administración de usuarios del sistema.
 */
import express from "express";
import UserController from "../controllers/UserController.js";
import { validateUserCreate, validateUserUpdate } from "../middlewares/validate-modules/validateUser.js";

const router = express.Router();

// Endpoints semánticos bajo la raíz del recurso asignado en app.js (/api/users)
router.get("/", UserController.getAllUsers);
router.post("/", validateUserCreate, UserController.processCreateUser);

// Helper para el frontend para listar miembros que no tienen usuario asignado todavía
router.get("/available-members", UserController.getAvailableMembers);

// Operaciones específicas sobre un recurso ID
router.get("/:id", UserController.getUserById);
router.put("/:id", validateUserUpdate, UserController.processUpdateUser);
router.delete("/:id", UserController.deleteUser); 

export default router;