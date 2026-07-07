/**
 * @file DashboardController.js
 * @description Controlador API REST para el suministro de contextos analíticos y paneles personalizados.
 */
import DashboardService from '../services/DashboardService.js';

class DashboardController {

    /**
     * GET /api/dashboard/admin
     * Entrega las métricas globales y de analítica financiera (Bento Grid)
     */
    static async getAdminMetrics(req, res) {
        try {
            const currentYear = new Date().getFullYear();
            const metrics = await DashboardService.getBentoGridData(currentYear);

            return res.status(200).json({
                status: "success",
                year: currentYear,
                data: metrics
            });
        } catch (error) {
            console.error("Fallo en DashboardController.getAdminMetrics:", error);
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message || "Error al procesar el tablero administrativo."
            });
        }
    }

    /**
     * GET /api/dashboard/user-portal
     * Entrega el perfil y turnos del miembro logueado basándose en su ID de sesión/token
     */
    static async getUserPortal(req, res) {
        try {
            // Se extrae el ID de usuario desde la sesión autenticada
            const userId = req.session?.user?.id_usuario;
            
            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "Sesión no válida o expirada. Autenticación requerida."
                });
            }

            const memberBentoData = await DashboardService.getMemberDashboardSummary(userId);

            // CONTROL DE FLUJO SEMÁNTICO: Cuenta creada pero sin vinculación al censo (miembro)
            if (!memberBentoData) {
                return res.status(200).json({
                    status: "pending_profile",
                    message: "Tu cuenta de usuario se encuentra en proceso de verificación y vinculación al censo."
                });
            }

            return res.status(200).json({
                status: "success",
                data: memberBentoData
            });
        } catch (error) {
            console.error("Fallo en DashboardController.getUserPortal:", error);
            return res.status(error.status || 500).json({
                status: "error",
                message: error.message || "Error al procesar el sumario del usuario."
            });
        }
    }
}

export default DashboardController;