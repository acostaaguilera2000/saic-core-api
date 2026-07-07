/**
 * @file ProfileController.js
 * @description Controlador API REST para consulta y modificación segura de perfiles de usuario.
 */
import ProfileService from "../services/ProfileService.js";
import User from "../models/User.js";

class ProfileController {

    // GET /api/profile
    static async getProfile(req, res) {
        try {
            // Se asume que el ID viene del middleware de autenticación global de tu app
            const userId = req.user?.id_usuario || req.session?.user?.id_usuario;
            
            if (!userId) {
                return res.status(401).json({ status: "error", error: "No autorizado. Sesión inexistente." });
            }

            const userProfile = await User.findById(userId);
            if (!userProfile) {
                return res.status(404).json({ status: "error", error: "Usuario no encontrado." });
            }

            // Sanitizamos el objeto para jamás exponer el hash de la contraseña en el JSON
            const { password, ...safeProfile } = userProfile;

            return res.status(200).json({ status: "success", data: safeProfile });
        } catch (err) {
            console.error("Error en ProfileController.getProfile:", err);
            return res.status(500).json({ status: "error", error: "No se pudo cargar la información de su perfil." });
        }
    }

    // PUT /api/profile
    static async processUpdateProfile(req, res) {
        try {
            const userId = req.user?.id_usuario || req.session?.user?.id_usuario;
            
            if (!userId) {
                return res.status(401).json({ status: "error", error: "No autorizado. Sesión caducada." });
            }

            // Delegamos los cambios y obtenemos el usuario modificado
            const updatedUser = await ProfileService.updateOwnProfile(userId, req.body);

            // Si aún usas sesiones mixtas en transición, actualizamos el username en memoria de sesión
            if (req.session?.user) {
                req.session.user.username = updatedUser.username;
            }

            return res.status(200).json({ 
                status: "success", 
                message: "Tu perfil ha sido actualizado correctamente.",
                user: updatedUser 
            });

        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error en ProfileController.processUpdateProfile:", err);
            return res.status(500).json({ status: "error", error: "Ocurrió un error interno al actualizar el perfil." });
        }
    }
}

export default ProfileController;