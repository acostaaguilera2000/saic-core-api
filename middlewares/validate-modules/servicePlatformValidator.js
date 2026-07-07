const validateCommonFields = (culto, index, errors) => {
    const filaNum = index + 1;
    const { fecha, hora, tipo_culto, id_dirigente, dirigente_externo, id_predicador, predicador_externo } = culto;

    if (!fecha || fecha.trim() === "") {
        errors.push(`Fila ${filaNum}: La fecha del servicio es un campo obligatorio.`);
    }

    if (!hora || hora.trim() === "") {
        errors.push(`Fila ${filaNum}: La hora del servicio es un campo obligatorio.`);
    }

    if (!tipo_culto || tipo_culto.trim() === "") {
        errors.push(`Fila ${filaNum}: El tipo de servicio es un campo obligatorio.`);
    } else if (tipo_culto.trim().length < 3) {
        errors.push(`Fila ${filaNum}: El tipo de servicio debe contener al menos 3 caracteres.`);
    }

    // Reglas de negocio: Validar que exista al menos un encargado local o externo
    if (!id_dirigente && (!dirigente_externo || dirigente_externo.trim() === "")) {
        errors.push(`Fila ${filaNum}: Debe asignar un dirigente (interno o externo).`);
    }

    if (!id_predicador && (!predicador_externo || predicador_externo.trim() === "")) {
        errors.push(`Fila ${filaNum}: Debe asignar un predicador (interno o externo).`);
    }
};

/**
 * Middleware para validar la creación y edición de cultos
 */
export const validateServicePlatform = (req, res, next) => {
    const errors = [];

    // Si viene de la creación masiva, "req.body.cultos" será un Array
    if (req.body.cultos && Array.isArray(req.body.cultos)) {
        req.body.cultos.forEach((culto, index) => {
            validateCommonFields(culto, index, errors);
        });
    } else {
        // Si viene de la edición (objeto individual plano en req.body), lo validamos directamente como índice 0
        validateCommonFields(req.body, 0, errors);
    }

    if (errors.length > 0) {
        req.validationErrors = errors;
    }

    next();
};