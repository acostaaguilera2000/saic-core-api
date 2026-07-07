/**
 * @file error.js
 * @description Middleware centralizado para el manejo de excepciones y códigos de estado HTTP en formato REST JSON.
 * @author Manuel Andrés Acosta Aguilera
 */

const error = {
    // 404 - Not Found (Recurso no encontrado)
    error404: (req, res) => {
        return res.status(404).json({
            status: "error",
            code: 404,
            error: "Not Found",
            message: "El recurso o endpoint que estás buscando no existe en SAIC-CORE-API."
        });
    },

    // 400 - Bad Request (Petición incorrecta / Errores de validación sintáctica)
    error400: (req, res, err) => {
        return res.status(400).json({
            status: "error",
            code: 400,
            error: "Bad Request",
            message: err?.message || err || "La solicitud contiene sintaxis inválida o parámetros incorrectos."
        });
    },

    // 401 - Unauthorized (Se requiere autenticación por Token)
    error401: (req, res, err) => {
        return res.status(401).json({
            status: "error",
            code: 401,
            error: "Unauthorized",
            message: err?.message || err || "Acceso denegado. Se requiere un token JWT válido para consumir este recurso."
        });
    },

    // 403 - Forbidden (Autenticado pero sin privilegios de Rol adecuados)
    error403: (req, res, err) => {
        return res.status(403).json({
            status: "error",
            code: 403,
            error: "Forbidden",
            message: err?.message || err || "Privilegios insuficientes. Tu rol no tiene permisos para realizar esta acción."
        });
    },

    // 500 - Internal Server Error (Fallos críticos de base de datos o excepciones de código)
    error500: (req, res, err) => {
        console.error("❌ [CRITICAL DATABASE/SERVER ERROR]:", err);
        
        return res.status(500).json({
            status: "error",
            code: 500,
            error: "Internal Server Error",
            message: "Ha ocurrido una falla interna en el servidor de servicios.",
            details: err?.message || err || null
        });
    }
};

export default error;