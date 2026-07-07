/**
 * @file dashboardRoutes.js
 * @description Rutas de la API para los componentes de indicadores y paneles del sistema SAIC.
 */
import { Router } from 'express';
import DashboardController from '../controllers/DashboardController.js';

const router = Router();

// Endpoint para tableros administrativos (Gráficos, KPIs globales, auditorías rápidas)
// Consumo: GET /api/dashboard/admin
router.get('/admin', DashboardController.getAdminMetrics);

// Endpoint para el portal personal del usuario común (Mis datos, mis responsabilidades en cultos)
// Consumo: GET /api/dashboard/user-portal
router.get('/user-portal', DashboardController.getUserPortal);

export default router;