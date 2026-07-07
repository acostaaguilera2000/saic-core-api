const validateCulto = (req, res, next) => {
    const errores = [];
    const { cultos, fecha, hora, tipo_culto } = req.body;

    // ESCENARIO 1: Creación Masiva (Arreglo)
    if (req.originalUrl.includes("/create") && req.method === "POST") {
        if (!cultos || !Array.isArray(cultos) || cultos.length === 0) {
            errores.push("Debe programar al menos un servicio en el listado.");
        } else {
            cultos.forEach((c, index) => {
                const numFila = index + 1;
                if (!c.fecha) errores.push(`Fila ${numFila}: La fecha del culto es obligatoria.`);
                if (!c.hora) errores.push(`Fila ${numFila}: La hora del culto es obligatoria.`);
                if (!c.tipo_culto || c.tipo_culto.trim() === "") {
                    errores.push(`Fila ${numFila}: Debe especificar el tipo de culto.`);
                }
            });
        }
    } 
    // ESCENARIO 2: Edición Individual (Objeto Plano)
    else if (req.originalUrl.includes("/update") && req.method === "POST") {
        if (!fecha) errores.push("La fecha es requerida para actualizar el servicio.");
        if (!hora) errores.push("La hora es requerida para actualizar el servicio.");
        if (!tipo_culto || tipo_culto.trim() === "") errores.push("El tipo de culto no puede quedar vacío.");
    }

    if (errores.length > 0) {
        req.validationErrors = errores;
    }

    next();
};

export default validateCulto;