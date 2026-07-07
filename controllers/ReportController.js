/**
 * @file ReportController.js
 * @description Controlador API REST para el suministro de datos estadísticos y analíticos de SAIC.
 */
import ReportService from "../services/ReportService.js";

class ReportController {

    // GET /api/reports/services
    static async getServicesReport(req, res) {
        try {
            const { month } = req.query; // Recibe el parámetro por query string (ej: ?month=05)
            const currentYear = new Date().getFullYear();

            // Desacoplamiento: Delegamos el análisis y filtrado al servicio
            const cronograma = await ReportService.getServicesByMonth(month, currentYear);

            return res.status(200).json({
                status: "success",
                year: currentYear,
                selectedMonth: month || "Todos",
                count: cronograma.length,
                data: cronograma
            });
        } catch (err) {
            console.error("Error crítico en ReportController.getServicesReport:", err);
            return res.status(500).json({
                status: "error",
                error: "Error interno al procesar y consolidar el reporte de servicios."
            });
        }
    }
}

export default ReportController;