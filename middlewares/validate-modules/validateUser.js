/**
 * @file validateUser.js
 * @description Validaciones para la creación y actualización de usuarios en la API REST.
 */

const validateCommonFields = (req, errors) => {
    const { username, email, rol, id_miembro } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        errors.push("Debe ingresar un email válido.");
    }

    const allowedRoles = ["admin", "tesorero", "lider", "miembro"];
    if (!rol || !allowedRoles.includes(rol)) {
        errors.push("Debe seleccionar un rol válido.");
    }

    if (id_miembro && isNaN(Number(id_miembro))) {
        errors.push("El miembro asociado debe ser un número válido.");
    }

    if (!username || username.trim() === "") {
        errors.push("El nombre de usuario es un campo obligatorio.");
    } else {
        if (username.trim().length < 3) {
            errors.push("El nombre de usuario debe contener al menos 3 caracteres.");
        }
        const usernameRegex = /^[a-zA-Z0-9_.]+$/;
        if (!usernameRegex.test(username.trim())) {
            errors.push("El nombre de usuario solo puede contener letras, números, puntos o guiones bajos.");
        }
    }
};

// Validar al crear (Contraseña Obligatoria)
export const validateUserCreate = (req, res, next) => {
    const { password } = req.body;
    const errors = [];

    validateCommonFields(req, errors);

    if (!password || password.length < 6) {
        errors.push("La contraseña es obligatoria y debe tener al menos 6 caracteres.");
    }

    // CORTOCIRCUITO REST: Si hay errores, respondemos aquí mismo sin tocar el controlador
    if (errors.length > 0) {
        return res.status(400).json({
            status: "error",
            errors: errors
        });
    }
    next();
};

// Validar al actualizar (Contraseña Opcional)
export const validateUserUpdate = (req, res, next) => {
    const { password } = req.body;
    const errors = [];

    validateCommonFields(req, errors);

    if (password && password.trim().length < 6) {
        errors.push("La nueva contraseña debe tener al menos 6 caracteres.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: "error",
            errors: errors
        });
    }
    next();
};