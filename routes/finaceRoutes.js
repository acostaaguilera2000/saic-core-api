/**
 * @file financeRoutes.js
 * @description Enrutamiento RESTful para el control contable e ingresos de SAIC.
 */
import express from 'express';
import FinanceController from '../controllers/FinanceController.js';
import { validateDonationInput } from '../middlewares/validate-modules/financeValidation.js';

const router = express.Router();

// Nota: Recuerda anteponer tus middlewares de roles (ej. Líder/Admin) si deseas restringir accesos.

// Obtener el historial contable y lista de miembros
router.get('/', FinanceController.getDashboard);

// Registrar un nuevo ingreso financiero
router.post('/', validateDonationInput, FinanceController.createDonation);

// Anular una transacción contable existente (Modificación de estado parcial)
router.patch('/:id/cancel', FinanceController.cancelDonation);

export default router;