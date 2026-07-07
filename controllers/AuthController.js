/**
 * @file AuthController.js
 * @description Controlador REST para la autenticación de usuarios emisores de JWT.
 */
import AuthService from "../services/AuthService.js";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/error.js";

class AuthController {

    static async processLogin(req, res) {
        try {
            const { email, password } = req.body;
            
            // 1. Validar las credenciales en la capa de servicios
            const authenticatedUser = await AuthService.authenticateUser(email, password);

            // 2. Estructurar el Payload del Token (Evitamos guardar la contraseña aquí por seguridad)
            const tokenPayload = {
                id_usuario: authenticatedUser.id_usuario,
                username: authenticatedUser.username,
                email: authenticatedUser.email,
                rol: authenticatedUser.rol,
                id_miembro: authenticatedUser.id_miembro
            };

            // 3. Firmar el token JWT de manera asíncrona (Expira en 2 horas por seguridad)
            const secretKey = process.env.JWT_SECRET || "clave_secreta_saic_2026";
            const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "2h" });

            // 4. Responder al cliente con éxito absoluto, inyectando el token de acceso
            return res.status(200).json({
                status: "success",
                message: "Autenticación satisfactoria",
                token: token,
                user: {
                    username: authenticatedUser.username,
                    email: authenticatedUser.email,
                    rol: authenticatedUser.rol
                }
            });

        } catch (err) {
            // Captura de errores de negocio (Ej: El usuario no existe o clave errónea)
            if (err.name === "AuthenticationError") {
                return res.status(401).json({ 
                    status: "error", 
                    error: "Error en la autenticación",
                    details: err.message
                });
            }
            
            console.error("Critical failure in AuthController.processLogin:", err);
            return res.status(500).json({ error: "Falla interna en el servidor de autenticación." });
        }
    }

    static processLogout(req, res) {
        // En JWT el backend es stateless, por lo que el logout se realiza en el Frontend
        // destruyendo el token guardado. Dejamos un endpoint semántico de confirmación:
        return res.status(200).json({ 
            status: "success", 
            message: "Cierre de sesión semántico exitoso. Elimine el token del almacenamiento del cliente." 
        });
    }
}

export default AuthController;