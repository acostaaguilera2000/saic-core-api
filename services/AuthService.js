import User from "../models/User.js";
import bcrypt from "bcrypt";

class AuthService {
    /**
     * Valida las credenciales de acceso de un usuario en el sistema
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} Datos del usuario autenticado si es exitoso
     */
    static async authenticateUser(email, password) {
        // Buscamos al usuario por su email usando el método estandarizado del modelo
        const user = await User.findByEmail(email.trim());
        
        if (!user) {
            const authError = new Error(`El usuario con el correo electrónico "${email}" no existe.`);
            authError.name = "AuthenticationError";
            throw authError;
        }

        // Validación de la contraseña usando el hash seguro de bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const authError = new Error("La contraseña ingresada es incorrecta.");
            authError.name = "AuthenticationError";
            throw authError;
        }

        return user;
    }
}

export default AuthService;