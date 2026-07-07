/**
 * @file FinanceService.js
 */
import Finance from '../models/Finance.js';
import Member from '../models/Member.js';

class FinanceService {

    static async getDashboardContext() {
        try {
            const [members, donations] = await Promise.all([
                Member.findAllActive(),
                Finance.getRecentDonations()
            ]);

            return {
                miembros: members,
                donaciones: donations
            };
        } catch (error) {
            console.error("Error en FinanceService.getDashboardContext:", error);
            throw error.status ? error : { status: 500, message: "Error al compilar el contexto financiero." };
        }
    }

    static async processTransaction(payload) {
        try {
            // Desestructuramos tipo_pago del payload entrante
            const { procedencia, monto, fecha, categoria_ingreso, tipo_pago, observacion } = payload;
            let assignedMemberId = null;
            let assignedExternalId = null;

            if (procedencia === 'interno') {
                assignedMemberId = parseInt(payload.id_miembro, 10);
                const memberExists = await Member.findById(assignedMemberId);
                if (!memberExists) {
                    throw { status: 404, message: "El miembro seleccionado no figura registrado en el censo actual." };
                }
            } else {
                assignedExternalId = await Finance.findOrCreateExternalDonor(payload.nombre_externo.trim());
            }

            // Enviamos el bloque completo respetando los nombres esperados por la query SQL de Finance.js
            await Finance.insertDonation({
                monto: monto,
                fecha_registro: fecha,
                tipo_pago: tipo_pago.trim(), // <--- Mapeo clave para solucionar el error 23000
                categoria_ingreso: categoria_ingreso.trim(),
                observacion: observacion || null,
                id_miembro: assignedMemberId,
                id_externo: assignedExternalId
            });
        } catch (error) {
            console.error("Error en FinanceService.processTransaction:", error);
            throw error.status ? error : { status: 500, message: "Error al asentar el registro de la donación en la base de datos." };
        }
    }

    static async cancelTransaction(idDonacion) {
        try {
            const idParsed = parseInt(idDonacion, 10);
            if (isNaN(idParsed)) {
                throw { status: 400, message: "El identificador de la transacción provisto no es válido." };
            }
            return await Finance.updateStatus(idParsed, 'Anulada');
        } catch (error) {
            console.error("Error en FinanceService.cancelTransaction:", error);
            throw error.status ? error : { status: 500, message: "Error al gestionar la anulación del asiento." };
        }
    }
}

export default FinanceService;