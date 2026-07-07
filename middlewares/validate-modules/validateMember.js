/**
 * @file validateMember.js
 * @description Validaciones de campos sintácticos para la creación y edición de miembros en la API REST.
 */

const numericoRegex = /^\d+$/;

// Validación al CREAR un miembro
export const validate = (req, res, next) => {
    const { nombre, apellido, documento, fecha_registro } = req.body;
    const errors = [];

    if (!nombre || nombre.trim() === "") {
        errors.push("El nombre es obligatorio y no puede estar vacío.");
    }

    if (!apellido || apellido.trim() === "") {
        errors.push("El apellido es obligatorio y no puede estar vacío.");
    }

    if (!documento || documento.trim() === "") {
        errors.push("El documento de identidad es obligatorio.");
    } else {
        const docTrim = documento.trim();
        if (!numericoRegex.test(docTrim)) {
            errors.push("El documento de identidad debe contener únicamente números.");
        }
        if (docTrim.length < 8 || docTrim.length > 10) {
            errors.push("El documento de identidad (C.C.) debe tener entre 8 y 10 dígitos.");
        }
    }

    if (!fecha_registro || fecha_registro.trim() === "") {
        errors.push("La fecha de registro es obligatoria.");
    }

    // CORTOCIRCUITO REST: Si hay errores de entrada, respondemos aquí de inmediato
    if (errors.length > 0) {
        return res.status(400).json({
            status: "error",
            errors: errors
        });
    }
    next();
};

// Validación al ACTUALIZAR un miembro
export const validateMemberUpdate = (req, res, next) => {
    const { nombre, apellido, documento, fecha_registro } = req.body;
    const errors = [];

    if (nombre !== undefined && (!nombre || nombre.trim() === "")) {
        errors.push("El nombre modificado no puede quedar vacío.");
    }

    if (apellido !== undefined && (!apellido || apellido.trim() === "")) {
        errors.push("El apellido modificado no puede quedar vacío.");
    }

    if (documento !== undefined) {
        if (!documento || documento.trim() === "") {
            errors.push("El documento de identidad modificado no puede quedar vacío.");
        } else {
            const docTrim = documento.trim();
            if (!numericoRegex.test(docTrim)) {
                errors.push("El documento de identidad debe contener únicamente números.");
            }
            if (docTrim.length < 8 || docTrim.length > 10) {
                errors.push("El documento de identidad (C.C.) debe tener entre 8 y 10 dígitos.");
            }
        }
    }

    if (fecha_registro !== undefined && (!fecha_registro || fecha_registro.trim() === "")) {
        errors.push("La fecha de registro modificada debe ser una fecha válida.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: "error",
            errors: errors
        });
    }
    next();
};