/**
 * @file financeValidation.js
 * @description Middleware de validación y sanitización con listas blancas estrictas para categorías y tipos de pago.
 */
export const validateDonationInput = (req, res, next) => {
    let { procedencia, id_miembro, nombre_externo, monto, fecha, categoria_ingreso, tipo_pago } = req.body;
    const errors = [];

    // --- 1. LISTAS BLANCAS DEFINIDAS (Reglas de Negocio) ---
    const TIPOS_PAGO_PERMITIDOS = ['Efectivo', 'Transferencia', 'Consignacion', 'Cheque'];
    const CATEGORIAS_PERMITIDAS = ['Ofrenda General', 'Diezmo', 'Donacion Especial', 'Pro-Templo'];

    // --- 2. VALIDACIÓN Y SANITIZACIÓN DE MONTO ---
    if (!monto || (typeof monto === "string" && monto.trim() === '')) {
        errors.push("El monto de la transaccion es obligatorio.");
    } else {
        if (typeof monto === "string") {
            let montoSanitizado = monto.replace(/\.(?=\d{3}(\D|$))/g, ""); 
            montoSanitizado = montoSanitizado.replace(/,/g, ""); 
            const valorNumerico = parseFloat(montoSanitizado);

            if (isNaN(valorNumerico) || valorNumerico <= 0) {
                errors.push("El monto debe ser un valor numerico valido y mayor a cero.");
            } else {
                req.body.monto = valorNumerico;
            }
        } else if (typeof monto === "number" && monto <= 0) {
            errors.push("El monto debe ser mayor a cero.");
        }
    }

    // --- 3. VALIDACIÓN DE FECHA ---
    if (!fecha || fecha.trim() === '') {
        errors.push("La fecha de registro del ingreso financiero es requerida.");
    }

    // --- 4. VALIDACIÓN ESTRICTA DE CATEGORÍA DE INGRESO ---
    if (!categoria_ingreso || categoria_ingreso.trim() === '') {
        errors.push("La categoria del ingreso es obligatoria.");
    } else {
        const categoriaLimpia = categoria_ingreso.trim();
        if (!CATEGORIAS_PERMITIDAS.includes(categoriaLimpia)) {
            errors.push(`La categoria '${categoriaLimpia}' no es valida. Valores permitidos: ${CATEGORIAS_PERMITIDAS.join(', ')}.`);
        } else {
            req.body.categoria_ingreso = categoriaLimpia; // Aseguramos el valor limpio sin espacios extra
        }
    }

    // --- 5. VALIDACIÓN ESTRICTA DE TIPO DE PAGO ---
    if (!tipo_pago || tipo_pago.trim() === '') {
        errors.push("El tipo de pago es obligatorio.");
    } else {
        const pagoLimpio = tipo_pago.trim();
        if (!TIPOS_PAGO_PERMITIDOS.includes(pagoLimpio)) {
            errors.push(`El tipo de pago '${pagoLimpio}' no es valido. Valores permitidos: ${TIPOS_PAGO_PERMITIDOS.join(', ')}.`);
        } else {
            req.body.tipo_pago = pagoLimpio; // Aseguramos el valor limpio
        }
    }

    // --- 6. VALIDACIÓN DE PROCEDENCIA ---
    if (procedencia === 'interno') {
        if (!id_miembro || id_miembro.toString().trim() === '') {
            errors.push("Debe seleccionar un miembro valido de la lista para procedencia interna.");
        }
    } else if (procedencia === 'externo') {
        if (!nombre_externo || nombre_externo.trim() === '') {
            errors.push("El nombre del donante externo es requerido para procedencia externa.");
        }
    } else {
        errors.push("La procedencia especificada debe ser 'interno' o 'externo'.");
    }

    // --- 7. CORTOCIRCUITO REST ---
    if (errors.length > 0) {
        return res.status(400).json({ status: "error", errors });
    }

    next();
};