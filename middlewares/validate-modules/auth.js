/**
 * @file auth.js
 * @description Middleware para proteger rutas verificando el JSON Web Token (JWT) entrante.
 */
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    // 1. Obtener el encabezado 'Authorization' de la petición
    const authHeader = req.headers['authorization'];
    
    // El encabezado suele venir con el formato: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            status: "error", 
            error: "Acceso denegado. No se proporcionó un token de autenticación." 
        });
    }

    try {
        // 2. Verificar si el token es legítimo usando la clave secreta del entorno
        const secretKey = process.env.JWT_SECRET || "clave_secreta_saic_2026";
        const decoded = jwt.verify(token, secretKey);
        
        // 3. Inyectar los datos del usuario decodificados en la petición actual
        req.user = decoded; 
        
        return next(); // Damos luz verde al siguiente controlador
    } catch (error) {
        return res.status(403).json({ 
            status: "error", 
            error: "Token inválido o expirado. Autenticación fallida." 
        });
    }
};