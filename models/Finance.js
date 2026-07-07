import db from '../config/db.js';

/**
 * Modelo encargado de la persistencia y ejecución de queries SQL puras para el módulo de finanzas
 * @class Finance
 */
class Finance {

    /**
     * Obtiene el historial de las últimas 10 donaciones asentadas o anuladas en el sistema SAIC
     * @static
     * @async
     * @returns {Promise<Array<Object>>} Registros contables cruzados con miembro o externo, incluyendo su estado
     * @throws {Object} Estructura de error estandarizada con código de estado y mensaje descriptivo
     */
    static async getRecentDonations() {
        try {
            const query = `
                SELECT d.id_donacion, d.monto, d.fecha_registro, d.categoria_ingreso, d.estado,
                       CONCAT(m.nombre, ' ', m.apellido) AS nombre_miembro,
                       e.nombre_completo AS nombre_externo
                FROM donaciones d
                LEFT JOIN miembro m ON d.id_miembro = m.id_miembro
                LEFT JOIN donantes_externos e ON d.id_externo = e.id_externo
                ORDER BY d.fecha_registro DESC, d.id_donacion DESC 
                
            `;
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Error en Finance.getRecentDonations:", error);
            throw { status: 500, message: "Error al listar el historial de donaciones recientes." };
        }
    }

    /**
     * Registra un nuevo donante externo en la base de datos
     * @static
     * @async
     * @param {Object} dataExterno - Datos informativos del aportante externo
     * @returns {Promise<number>} El id_externo generado por la base de datos
     * @throws {Object} Estructura de error estandarizada con código de estado y mensaje descriptivo
     */
    static async createExternalDonor({ nombre_completo, telefono, correo }) {
        try {
            const query = `
                INSERT INTO donantes_externos (nombre_completo, telefono, correo) 
                VALUES (?, ?, ?)
            `;
            const [result] = await db.query(query, [nombre_completo, telefono, correo]);
            return result.insertId;
        } catch (error) {
            console.error("Error en Finance.createExternalDonor:", error);
            throw { status: 500, message: "Error al registrar la información del donante externo." };
        }
    }

    /**
     * Inserta el registro contable definitivo de la donación en la base de datos
     * @static
     * @async
     * @param {Object} dataDonacion - Datos estructurados del ingreso monetario
     * @returns {Promise<boolean>} Retorna verdadero si la operación concluyó con éxito
     * @throws {Object} Estructura de error estandarizada con código de estado y mensaje descriptivo
     */
    static async insertDonation({ monto, fecha_registro, tipo_pago, categoria_ingreso, observacion, id_miembro, id_externo }) {
        try {
            const query = `
                INSERT INTO donaciones 
                (monto, fecha_registro, tipo_pago, categoria_ingreso, observacion, id_miembro, id_externo) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            await db.query(query, [monto, fecha_registro, tipo_pago, categoria_ingreso, observacion, id_miembro, id_externo]);
            return true;
        } catch (error) {
            console.error("Error en Finance.insertDonation:", error);
            throw { status: 500, message: "Error al asentar el registro de la donación en la base de datos." };
        }
    }

    /**
     * Cambia el estado de una donación específica (Utilizado para procesos de Anulación)
     * @static
     * @async
     * @param {number} idDonacion - El identificador único de la donación
     * @param {string} nuevoEstado - El estado al que cambiará ('Asentada' o 'Anulada')
     * @returns {Promise<boolean>} Retorna verdadero si se afectó la fila correctamente
     * @throws {Object} Estructura de error estandarizada con código de estado y mensaje descriptivo
     */
    static async updateStatus(idDonacion, nuevoEstado) {
        try {
            const query = `
                UPDATE donaciones 
                SET estado = ? 
                WHERE id_donacion = ?
            `;
            const [result] = await db.query(query, [nuevoEstado, idDonacion]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error en Finance.updateStatus:", error);
            throw { status: 500, message: "Error al actualizar el estado de la transacción contable." };
        }
    }

    /**
     * Obtiene la suma consolidada de donaciones por mes para un año específico (Gráficos)
     * @static
     * @async
     * @param {number} year - Año de análisis (Ej: 2026)
     * @returns {Promise<Array<Object>>} Listado con las sumas estructuradas de los 12 meses
     */
    static async getMonthlyDonationsSumByYear(year) {
        try {
            const query = `
                SELECT 
                    MONTH(fecha_registro) AS mes,
                    SUM(monto) AS total_mes
                FROM donaciones
                WHERE YEAR(fecha_registro) = ? AND estado = 'Asentada'
                GROUP BY MONTH(fecha_registro)
                ORDER BY mes ASC
            `;
            const [rows] = await db.query(query, [year]);
            return rows;
        } catch (error) {
            console.error("Error en Finance.getMonthlyDonationsSumByYear:", error);
            throw { status: 500, message: "Error al compilar el histórico financiero anual." };
        }
    }
}

export default Finance;