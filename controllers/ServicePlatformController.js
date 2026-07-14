/**
 * @file ServicePlatformController.js
 * @description Controlador RESTful para la gestión de la agenda y programación de cultos.
 */
import ServicePlatformService from "../services/ServicePlatformService.js";

class ServicePlatformController {

    // GET /api/service (Historial/Lista completa de cultos)
    static async getAllServices(req, res) {
        try {
            const cultosRaw = await ServicePlatformService.getAllServices();

            // 🔹 Mapeo de la estructura plana SQL al formato { culto, logistica }
            const cultosMapeados = cultosRaw.map(row => ({
                culto: {
                    id_culto: row.id_culto,
                    fecha: row.fecha,
                    hora: row.hora,
                    tipo_culto: row.tipo_culto,
                    id_dirigente: row.id_dirigente,
                    dirigente_externo: row.dirigente_externo,
                    nombre_dirigente: row.nombre_dirigente,
                    apellido_dirigente: row.apellido_dirigente,
                    id_predicador: row.id_predicador,
                    predicador_externo: row.predicador_externo,
                    nombre_predicador: row.nombre_predicador,
                    apellido_predicador: row.apellido_predicador
                },
                logistica: row.id_logistica ? {
                    id_logistica: row.id_logistica,
                    id_culto: row.id_culto,
                    id_sonido: row.id_sonido,
                    id_multimedia: row.id_multimedia,
                    id_aseo: row.id_aseo,
                    observaciones: row.observaciones,
                    son_nom: row.son_nom,
                    son_ape: row.son_ape,
                    mul_nom: row.mul_nom,
                    mul_ape: row.mul_ape,
                    ase_nom: row.ase_nom,
                    ase_ape: row.ase_ape
                } : null
            }));

            return res.status(200).json({
                status: "success",
                data: cultosMapeados
            });
        } catch (err) {
            console.error("Error en ServicePlatformController.getAllServices:", err);
            return res.status(500).json({
                status: "error",
                error: "No se pudo recuperar la agenda de cultos."
            });
        }
    }

    // GET /api/service/schedule (Cronograma stand-alone de servicios futuros)
    static async getAllSchedule(req, res) {
        try {
            const cultos = await ServicePlatformService.getAllServices(true); // Filtra a partir de la fecha actual
            return res.status(200).json({
                status: "success",
                data: cultos
            });
        } catch (err) {
            console.error("Error en ServicePlatformController.getAllSchedule:", err);
            return res.status(500).json({
                status: "error",
                error: "No se pudo recuperar el cronograma de cultos futuros."
            });
        }
    }

    // GET /api/service/:id (Obtener los detalles de un culto específico por su ID)
    static async getServiceById(req, res) {
        try {
            const {
                id
            } = req.params;
            const culto = await ServicePlatformService.getServiceById(id);
            return res.status(200).json({
                status: "success",
                data: culto
            });
        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({
                    status: "error",
                    error: err.message
                });
            }
            console.error("Error en ServicePlatformController.getServiceById:", err);
            return res.status(500).json({
                status: "error",
                error: "Error al recuperar los detalles del culto."
            });
        }
    }

    // POST /api/service (Creación/Programación masiva o individual)
    static async processCreateService(req, res) {
        try {
            await ServicePlatformService.registerService(req.body);
            return res.status(201).json({
                status: "success",
                message: "La programación de cultos ha sido registrada exitosamente en la agenda."
            });
        } catch (err) {
            if (err.name === "BusinessValidationError") {
                return res.status(400).json({
                    status: "error",
                    error: err.message
                });
            }
            console.error("Error en ServicePlatformController.processCreateService:", err);
            return res.status(500).json({
                status: "error",
                error: "Error interno al procesar el registro de los servicios."
            });
        }
    }

    // PUT /api/service/:id (Actualización individual de un culto)
    static async processUpdateService(req, res) {
        try {
            const {
                id
            } = req.params;
            await ServicePlatformService.updateServiceInfo(id, req.body);

            return res.status(200).json({
                status: "success",
                message: "El culto seleccionado ha sido modificado correctamente."
            });
        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                return res.status(400).json({
                    status: "error",
                    error: err.message
                });
            }
            console.error("Error en ServicePlatformController.processUpdateService:", err);
            return res.status(500).json({
                status: "error",
                error: "Error interno al intentar actualizar el culto."
            });
        }
    }

    // DELETE /api/service/:id (Remoción definitiva del culto de la agenda)
    static async deleteService(req, res) {
        try {
            const {
                id
            } = req.params;
            await ServicePlatformService.removeService(id);

            return res.status(200).json({
                status: "success",
                message: "El culto ha sido removido de la agenda permanentemente."
            });
        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({
                    status: "error",
                    error: err.message
                });
            }
            console.error("Error en ServicePlatformController.deleteService:", err);
            return res.status(500).json({
                status: "error",
                error: "Error al intentar eliminar el culto."
            });
        }
    }
}

export default ServicePlatformController;