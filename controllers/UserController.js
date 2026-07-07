/**
 * @file UserController.js
 * @description Controlador RESTful puro para la gestión de usuarios administrativos.
 */
import UserService from "../services/UserService.js";
import User from "../models/User.js";
import Member from "../models/Member.js";

class UserController {

    // GET /api/users
    static async getAllUsers(req, res) {
        try {
            // Leemos el ID desde req.user (inyectado por el middleware de JWT)
            const activeSessionId = req.user.id_usuario;
            const users = await UserService.getManageableUsers(activeSessionId);

            return res.status(200).json({
                status: "success",
                data: users
            });
        } catch (err) {
            console.error("Error in UserController.getAllUsers:", err);
            return res.status(500).json({ status: "error", error: "No se pudo recuperar la lista de usuarios." });
        }
    }

    // GET /api/users/available-members (Endpoint útil para alimentar selects/dropdowns en el frontend)
    static async getAvailableMembers(req, res) {
        try {
            const availableMembers = await Member.findAvailableMembers();
            return res.status(200).json({
                status: "success",
                data: availableMembers
            });
        } catch (err) {
            console.error("Error in UserController.getAvailableMembers:", err);
            return res.status(500).json({ status: "error", error: "Error al cargar los miembros disponibles." });
        }
    }

    // POST /api/users
    static async processCreateUser(req, res) {
        try {
            // Las validaciones de campos ya las resolvió el middleware antes de entrar aquí
            await UserService.registerUser(req.body);
            
            return res.status(201).json({
                status: "success",
                message: "Usuario registrado exitosamente."
            });
        } catch (err) {
            if (err.name === "BusinessValidationError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error in UserController.processCreateUser:", err);
            return res.status(500).json({ status: "error", error: "Error inesperado al registrar el usuario." });
        }
    }

    // GET /api/users/:id
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ status: "error", error: "El usuario solicitado no existe." });
            }

            return res.status(200).json({
                status: "success",
                data: user
            });
        } catch (err) {
            console.error("Error in UserController.getUserById:", err);
            return res.status(500).json({ status: "error", error: "Error al cargar los datos del usuario." });
        }
    }

    // PUT /api/users/:id
    static async processUpdateUser(req, res) {
        const { id } = req.params;
        try {
            await UserService.updateAdministrativeUser(id, req.body);
            
            return res.status(200).json({
                status: "success",
                message: "Usuario actualizado correctamente."
            });
        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error in UserController.processUpdateUser:", err);
            return res.status(500).json({ status: "error", error: "Error interno al intentar actualizar el usuario." });
        }
    }

    // DELETE /api/users/:id
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await UserService.deleteUserAccount(id);

            return res.status(200).json({
                status: "success",
                message: "Cuenta de usuario eliminada de forma permanente."
            });
        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({ status: "error", error: err.message });
            }
            console.error("Error in UserController.deleteUser:", err);
            return res.status(500).json({ status: "error", error: "Error al intentar eliminar el usuario." });
        }
    }
}

export default UserController;