/**
 * @file ministryValidation.js
 * @description Validación sintáctica para la gestión de ministerios y asignación de miembros.
 */

const validateCommonFields = (req, errors) => {
    const { nombre, descripcion } = req.body;

    if (nombre !== undefined) {
        if (!nombre || nombre.trim() === "") {
            errors.push("El nombre del ministerio es un campo obligatorio.");
        } else if (nombre.trim().length < 4) {
            errors.push("El nombre del ministerio debe contener al menos 4 caracteres.");
        } else if (nombre.trim().length > 50) {
            errors.push("El nombre del ministerio no puede exceder los 50 caracteres.");
        }
    }

    if (descripcion !== undefined) {
        if (!descripcion || descripcion.trim() === "") {
            errors.push("La descripción del ministerio es un campo obligatorio.");
        } else if (descripcion.trim().length < 10) {
            errors.push("La descripción debe ser más detallada (mínimo 10 caracteres).");
        } else if (descripcion.trim().length > 255) {
            errors.push("La descripción no puede exceder los 255 caracteres.");
        }
    }
};

export const validateMinistryCreate = (req, res, next) => {
    const errors = [];
    
    // Al crear, ambos campos son estrictamente requeridos inicialmente
    if (!req.body.nombre) errors.push("El nombre del ministerio es un campo obligatorio.");
    if (!req.body.descripcion) errors.push("La descripción del ministerio es un campo obligatorio.");

    validateCommonFields(req, errors);

    if (errors.length > 0) {
        return res.status(400).json({ status: "error", errors });
    }
    next();
};

export const validateMinistryUpdate = (req, res, next) => {
    const errors = [];
    validateCommonFields(req, errors);

    if (errors.length > 0) {
        return res.status(400).json({ status: "error", errors });
    }
    next();
};

export const validateMinistryMemberAction = (req, res, next) => {
    // Obtenemos los valores combinados (pueden venir de params o body según el verbo REST)
    const id_ministerio = req.params.id || req.body.id_ministerio;
    const id_miembro = req.params.memberId || req.body.id_miembro;
    const errors = [];

    if (!id_ministerio || isNaN(Number(id_ministerio))) {
        errors.push("El identificador del ministerio debe ser un número válido.");
    }
    if (!id_miembro || isNaN(Number(id_miembro))) {
        errors.push("El miembro que intenta gestionar debe ser un número válido.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ status: "error", errors });
    }
    next();
};