/**
 * @file dashboardRoutes.js
 * @description Rutas de la API para los componentes de indicadores y paneles del sistema SAIC.
 */
import { Router } from 'express';
import DashboardController from '../controllers/DashboardController.js';
import { isAuthenticated } from '../middlewares/validate-modules/auth.js';
import { isRole } from '../middlewares/validate-modules/isRole.js';

const router = Router();

// Endpoint para tableros administrativos (Gráficos, KPIs globales, autorizaciones)
// Consumo: GET /api/dashboard/admin
router.get('/admin', isAuthenticated, isRole('admin', 'lider'), DashboardController.getAdminMetrics);

// Endpoint para el portal personal del miembro común (Sus datos, responsabilidades en cultos)
// Consumo: GET /api/dashboard/user-portal
router.get('/user-portal', isAuthenticated,isRole('miembro'), DashboardController.getUserPortal);

export default router;