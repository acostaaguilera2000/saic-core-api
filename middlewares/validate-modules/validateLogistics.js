/**
 * @file validateLogistics.js
 * @description Validación de datos logísticos tolerante a peticiones parciales (Postman/REST).
 */
const validateLogistics = (req, res, next) => {
    const errores = [];
    const { id_sonido, id_multimedia, id_aseo, observaciones } = req.body;

    // Solo se valida si el campo fue enviado en el payload (evita fallos en PUT parciales)
    if (id_sonido !== undefined && id_sonido !== null && id_sonido !== "") {
        if (isNaN(Number(id_sonido))) errores.push("El encargado de sonido seleccionado debe ser un ID numérico válido.");
    }
    if (id_multimedia !== undefined && id_multimedia !== null && id_multimedia !== "") {
        if (isNaN(Number(id_multimedia))) errores.push("El encargado de multimedia seleccionado debe ser un ID numérico válido.");
    }
    if (id_aseo !== undefined && id_aseo !== null && id_aseo !== "") {
        if (isNaN(Number(id_aseo))) errores.push("El encargado de aseo seleccionado debe ser un ID numérico válido.");
    }

    if (observaciones !== undefined && observaciones !== null) {
        if (observaciones.toString().length > 500) {
            errores.push("Las observaciones son demasiado extensas (máximo 500 caracteres).");
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({ status: "error", errors });
    }

    next();
};

export default validateLogistics;