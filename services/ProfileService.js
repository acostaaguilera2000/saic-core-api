/**
 * @file ProfileService.js
 * @description Lógica de negocio y verificación de credenciales hashes para el perfil de usuario.
 */
import User from "../models/User.js";
import bcrypt from "bcrypt";

class ProfileService {

    /**
     * Actualiza los datos del perfil del usuario logueado
     * @param {number} userId - ID del usuario extraído de la autenticación (JWT/Middleware)
     * @param {Object} profileData - Datos del formulario (username, currentPassword, newPassword)
     * @returns {Promise<Object>} Datos limpios del usuario modificado
     */
    static async updateOwnProfile(userId, profileData) {
        const { username, currentPassword, newPassword } = profileData;

        // 1. Obtener los datos actuales del usuario
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            const error = new Error("El usuario no existe en el sistema.");
            error.name = "NotFoundError";
            throw error;
        }

        // 2. Validación crítica de contraseña actual
        if (!currentPassword || currentPassword.trim() === "") {
            const error = new Error("Debe ingresar su contraseña actual para poder guardar los cambios.");
            error.name = "BusinessValidationError";
            throw error;
        }

        const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isMatch) {
            const error = new Error("La contraseña actual ingresada es incorrecta.");
            error.name = "BusinessValidationError";
            throw error;
        }

        // 3. Evitar duplicados de nombre de usuario
        if (username && username.trim() !== currentUser.username) {
            const usernameExists = await User.findByUsername(username.trim());
            if (usernameExists) {
                const error = new Error("El nombre de usuario ya está en uso por otra cuenta.");
                error.name = "BusinessValidationError";
                throw error;
            }
        }

        // 4. Cifrado de nueva contraseña si aplica
        let hashedNewPassword = null;
        if (newPassword && newPassword.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            hashedNewPassword = await bcrypt.hash(newPassword.trim(), salt);
        }

        // 5. Persistir en base de datos
        const finalUsername = username ? username.trim() : currentUser.username;
        await User.updateSelfProfile(finalUsername, hashedNewPassword, userId);

        // Retornamos la info limpia para que la API responda con el nuevo estado
        return {
            id_usuario: userId,
            username: finalUsername
        };
    }
}

export default ProfileService;