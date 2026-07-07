/**
 * @file isRole.js
 * @description Middleware para restringir endpoints REST según el rol decodificado del JWT.
 * @author Manuel Andrés Acosta Aguilera
 */
import error from "../error.js";

/**
 * Restringe el acceso a un endpoint según el rol del usuario autenticado
 * @param {...string} allowedRoles - Lista de roles permitidos (Ej: 'admin', 'tesorero')
 */
export const isRole = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Validar que los datos del usuario ya existan (inyectados previamente por isAuthenticated)
        if (!req.user) {
            return error.error401(req, res, "No autenticado. Falta el token de acceso.");
        }

        // 2. Extraer el rol directamente desde los datos decodificados del JWT
        const userRole = req.user.rol;

        // 3. Comprobar si el rol actual está incluido en los permitidos para esta ruta
        const hasPermission = allowedRoles.includes(userRole);

        if (hasPermission) {
            return next(); // ¡Rol autorizado! Continuamos al controlador
        }

        // 4. Registro de auditoría interna de seguridad y denegación de acceso JSON
        console.warn(`⚠️ [SEGURIDAD REST] Usuario @${req.user.username} con rol [${userRole}] intentó violar acceso.`);
        
        return error.error403(req, res, `No tienes permisos suficientes para interactuar con este recurso. Roles requeridos: [${allowedRoles.join(", ")}]`);
    };
};