import db from "../config/db.js";

class ServicePlatform {

    /**
     * Recupera el listado de cultos con sus respectivos dirigentes, predicadores y datos de logística.
     * @param {boolean} [upcomingOnly=false] - Si es true, solo retorna cultos desde la fecha actual en adelante.
     * @returns {Promise<Array>} Lista de cultos con logística integrada.
     */
    static async listAll(upcomingOnly = false) {
        try {
            let query = `
            SELECT 
                c.id_culto,
                c.fecha,
                c.hora,
                c.tipo_culto,
                c.id_dirigente,
                c.dirigente_externo,
                c.id_predicador,
                c.predicador_externo,
                m_dir.nombre AS nombre_dirigente,
                m_dir.apellido AS apellido_dirigente,
                m_pred.nombre AS nombre_predicador,
                m_pred.apellido AS apellido_predicador,
                -- 🔹 Campos de logística desde logistica_culto
                lc.id_logistica,
                lc.id_sonido,
                lc.id_multimedia,
                lc.id_aseo,
                lc.observaciones,
                m_son.nombre AS son_nom,
                m_son.apellido AS son_ape,
                m_mul.nombre AS mul_nom,
                m_mul.apellido AS mul_ape,
                m_ase.nombre AS ase_nom,
                m_ase.apellido AS ase_ape
            FROM culto c
            LEFT JOIN miembro m_dir ON c.id_dirigente = m_dir.id_miembro
            LEFT JOIN miembro m_pred ON c.id_predicador = m_pred.id_miembro
            -- 🔹 JOIN corregido hacia la tabla 'logistica_culto'
            LEFT JOIN logistica_culto lc ON c.id_culto = lc.id_culto
            LEFT JOIN miembro m_son ON lc.id_sonido = m_son.id_miembro
            LEFT JOIN miembro m_mul ON lc.id_multimedia = m_mul.id_miembro
            LEFT JOIN miembro m_ase ON lc.id_aseo = m_ase.id_miembro
        `;

            const queryParams = [];

            if (upcomingOnly) {
                query += ` WHERE c.fecha >= CURDATE()`;
            }

            query += ` ORDER BY c.fecha DESC, c.hora DESC`;

            const [rows] = await db.query(query, queryParams);
            return rows || [];
        } catch (error) {
            console.error("Error en ServicePlatform.listAll:", error);
            throw {
                status: 500,
                message: "Error al listar la agenda de cultos desde el repositorio."
            };
        }
    }
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    id_culto, fecha, hora, tipo_culto, 
                    id_dirigente, dirigente_externo, 
                    id_predicador, predicador_externo 
                FROM culto 
                WHERE id_culto = ?
            `;
            const [rows] = await db.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error en ServicePlatform.getById:", error);
            throw {
                status: 500,
                message: "Error al buscar el culto solicitado."
            };
        }
    }

    static async createMassive(records) {
        try {
            const query = `
                INSERT INTO culto (
                    fecha, hora, tipo_culto, 
                    id_dirigente, dirigente_externo, 
                    id_predicador, predicador_externo
                ) VALUES ?
            `;
            const [result] = await db.query(query, [records]);
            return result;
        } catch (error) {
            console.error("Error en ServicePlatform.createMassive:", error);
            throw {
                status: 500,
                message: "Falla crítica al insertar la programación masiva de cultos."
            };
        }
    }

    /**
     * ACTUALIZACIÓN REFACTORIZADA (REST COMPATIBLE)
     * Ahora incluye explícitamente los campos externos y mapea correctamente las posiciones de las variables.
     */
    static async update(id, data) {
        try {
            const query = `
                UPDATE culto 
                SET fecha = ?, 
                    hora = ?, 
                    tipo_culto = ?, 
                    id_dirigente = ?, 
                    dirigente_externo = ?, 
                    id_predicador = ?, 
                    predicador_externo = ?
                WHERE id_culto = ?
            `;

            const params = [
                data.fecha,
                data.hora,
                data.tipo_culto,
                data.id_dirigente,
                data.dirigente_externo,
                data.id_predicador,
                data.predicador_externo,
                id
            ];

            const [result] = await db.query(query, params);
            return result;
        } catch (error) {
            console.error("Error en ServicePlatform.update:", error);
            throw {
                status: 500,
                message: "Error de persistencia al intentar modificar el culto."
            };
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query("DELETE FROM culto WHERE id_culto = ?", [id]);
            return result;
        } catch (error) {
            console.error("Error en ServicePlatform.delete:", error);
            throw {
                status: 500,
                message: "No se pudo eliminar el culto de la agenda por conflictos de dependencias."
            };
        }
    }

    static async findActiveTurnsByMemberId(memberId) {
        try {
            const query = `
                SELECT c.fecha, c.hora, c.tipo_culto,
                    CASE 
                        WHEN c.id_dirigente = ? THEN 'Dirigente'
                        WHEN c.id_predicador = ? THEN 'Predicador'
                        WHEN l.id_sonido = ? THEN 'Sonido'
                        WHEN l.id_multimedia = ? THEN 'Multimedia'
                        WHEN l.id_aseo = ? THEN 'Aseo'
                        ELSE 'Colaborador'
                    END AS rol_servicio
                FROM culto c
                LEFT JOIN logistica_culto l ON c.id_culto = l.id_culto
                WHERE (c.id_dirigente = ? OR c.id_predicador = ? OR l.id_sonido = ? OR l.id_multimedia = ? OR l.id_aseo = ?)
                  AND c.fecha >= CURDATE()
                ORDER BY c.fecha ASC, c.hora ASC
            `;
            const [rows] = await db.query(query, [
                memberId, memberId, memberId, memberId, memberId,
                memberId, memberId, memberId, memberId, memberId
            ]);
            return rows;
        } catch (error) {
            console.error("Error en ServicePlatform.findActiveTurnsByMemberId:", error);
            throw {
                status: 500,
                message: "Error al consultar los turnos asignados del miembro."
            };
        }
    }
}

export default ServicePlatform;