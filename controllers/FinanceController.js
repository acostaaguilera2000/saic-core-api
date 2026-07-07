/**
 * @file FinanceController.js
 * @description Controlador API REST para auditoría y registro de ingresos financieros en la plataforma.
 */
import FinanceService from '../services/FinanceService.js';

class FinanceController {

    // GET /api/finance
    static async getDashboard(req, res) {
        try {
            const contextData = await FinanceService.getDashboardContext();
            return res.status(200).json({
                status: "success",
                data: {
                    donaciones: contextData.donaciones,
                    miembrosActivos: contextData.miembros // Útil si el frontend necesita rellenar un select
                }
            });
        } catch (error) {
            console.error("Fallo critico en FinanceController.getDashboard:", error);
            return res.status(error.status || 500).json({
                status: "error",
                error: error.message || "No se pudo recuperar la informacion contable."
            });
        }
    }

    // POST /api/finance
    static async createDonation(req, res) {
        try {
            await FinanceService.processTransaction(req.body);
            return res.status(201).json({
                status: "success",
                message: "Ingreso financiero registrado y asentado exitosamente."
            });
        } catch (error) {
            console.error("Fallo critico en FinanceController.createDonation:", error);
            return res.status(error.status || 500).json({
                status: "error",
                error: error.message || "Fallo interno al procesar la transaccion."
            });
        }
    }

    // PATCH /api/finance/:id/cancel
    static async cancelDonation(req, res) {
        try {
            const { id } = req.params;
            await FinanceService.cancelTransaction(id);
            return res.status(200).json({
                status: "success",
                message: "La transaccion financiera ha sido anulada correctamente en los libros contables."
            });
        } catch (error) {
            console.error("Fallo critico en FinanceController.cancelDonation:", error);
            return res.status(error.status || 500).json({
                status: "error",
                error: error.message || "No se pudo proceder con la anulacion de la transaccion."
            });
        }
    }
}

export default FinanceController;