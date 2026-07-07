/**
 * @file LogisticsController.js
 * @description Controlador API REST para el control de insumos y servidores logísticos de cultos.
 */
import LogisticsService from "../services/LogisticsService.js";

class LogisticsController {

    // GET /api/logistics
    static async getCalendar(req, res) {
        try {
            const calendar = await LogisticsService.getFullLogisticsCalendar();
            return res.status(200).json({ status: "success", data: calendar });
        } catch (err) {
            console.error("Error en LogisticsController.getCalendar:", err);
            return res.status(500).json({ status: "error", error: "No se pudo recuperar el calendario logístico." });
        }
    }

    // GET /api/logistics/culto/:idCulto
    static async getLogisticsByCulto(req, res) {
        try {
            const { idCulto } = req.params;
            const data = await LogisticsService.getLogisticsData(Number(idCulto));
            return res.status(200).json({ status: "success", data });
        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({ status: "error", error: err.message });
            }
            console.error("Error en LogisticsController.getLogisticsByCulto:", err);
            return res.status(500).json({ status: "error", error: "Error al recuperar la logística del culto." });
        }
    }

    // PUT /api/logistics/culto/:idCulto (Actúa como actualización o creación atómica mediante el servicio)
    static async processSaveLogistics(req, res) {
        const { idCulto } = req.params;
        try {
            await LogisticsService.saveLogisticsData(Number(idCulto), req.body);
            return res.status(200).json({ status: "success", message: "Logística del culto procesada y guardada correctamente." });
        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({ status: "error", error: err.message });
            }
            console.error("Error en LogisticsController.processSaveLogistics:", err);
            return res.status(500).json({ status: "error", error: "No se pudo actualizar la información logística." });
        }
    }
}

export default LogisticsController;