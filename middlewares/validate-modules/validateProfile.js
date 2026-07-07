/**
 * @file validateProfile.js
 * @description Validación sintáctica estricta para peticiones REST de actualización de perfil.
 */

const validateCommonFields = (req, errors) => {
    const { username, currentPassword } = req.body;

    // El username es obligatorio en el payload para este endpoint de perfil
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

    // Validación obligatoria de la contraseña actual (Bloqueo de seguridad)
    if (!currentPassword || currentPassword.trim() === "") {
        errors.push("Debe ingresar su contraseña actual para confirmar y guardar los cambios.");
    }
};

export const validateProfileUpdate = (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const errors = [];

    // 1. Validar campos obligatorios
    validateCommonFields(req, errors);

    // 2. Validar Nueva Contraseña (solo si se incluye en la petición)
    if (newPassword && newPassword.trim().length > 0) {
        if (newPassword.trim().length < 6) {
            errors.push("La nueva contraseña debe tener al menos 6 caracteres.");
        }

        // 3. Validar coincidencia de confirmación
        if (!confirmPassword || confirmPassword.trim() === "") {
            errors.push("Debe confirmar la nueva contraseña.");
        } else if (newPassword !== confirmPassword) {
            errors.push("La confirmación de la contraseña no coincide con la nueva contraseña.");
        }
    }

    // Cortocircuito directo en formato JSON
    if (errors.length > 0) {
        return res.status(400).json({ status: "error", errors });
    }

    next();
};