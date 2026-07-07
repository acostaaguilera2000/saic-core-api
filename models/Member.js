import db from "../config/db.js";

class Member {

    /**
     * Recupera el histórico completo de miembros ordenados por estado y orden alfabético
     * @returns {Promise<Array>} Lista de todos los miembros
     */
    static async findAll() {
        try {
            const [rows] = await db.query(
                "SELECT * FROM miembro ORDER BY activo DESC, apellido ASC, nombre ASC"
            );
            return rows || [];
        } catch (error) {
            console.error("Error in Member.findAll:", error);
            throw { status: 500, message: "Error al listar el histórico de miembros." };
        }
    }
    /**
     * Recupera todos los miembros activos 
     * @returns {Promise<Array>} Lista de todos los miembros activos
     */
    static async findAllActive() {
        try {
            const [rows] = await db.query(
                "SELECT * FROM miembro WHERE activo=1 ORDER BY activo DESC, apellido ASC, nombre ASC"
            );
            return rows || [];
        } catch (error) {
            console.error("Error in Member.findAll:", error);
            throw { status: 500, message: "Error al listar el histórico de miembros." };
        }
    }

    /**
     * Lista únicamente los miembros activos que no poseen una cuenta de usuario vinculada
     * @returns {Promise<Array>} Lista de miembros disponibles para asignación de credenciales
     */
    static async findAvailableMembers() {
        try {
            const [rows] = await db.query(`
                SELECT m.id_miembro, m.nombre, m.apellido, m.documento 
                FROM miembro m
                LEFT JOIN usuario u ON m.id_miembro = u.id_miembro
                WHERE u.id_usuario IS NULL AND m.activo = 1
                ORDER BY m.apellido, m.nombre
            `);
            return rows || [];
        } catch (error) {
            console.error("Error in Member.findAvailableMembers:", error);
            throw { status: 500, message: "Error al listar los miembros disponibles." };
        }
    }

    /**
     * Busca un miembro específico por su clave primaria
     * @param {number} memberId 
     * @returns {Promise<Object|null>} Datos del miembro o null si no se encuentra
     */
    static async findById(memberId) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM miembro WHERE id_miembro = ?",
                [memberId]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in Member.findById:", error);
            throw { status: 500, message: "Error al obtener miembro por ID." };
        }
    }

    /**
     * Busca registros que coincidan con un documento de identidad específico
     * @param {string} document 
     * @returns {Promise<Array>} Coincidencias encontradas
     */
    static async findByDocument(document) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM miembro WHERE documento = ?",
                [document]
            );
            return rows || [];
        } catch (error) {
            console.error("Error in Member.findByDocument:", error);
            throw { status: 500, message: "Error al buscar miembro por documento." };
        }
    }

    /**
     * Verifica si el miembro ya tiene una cuenta de usuario en el sistema
     * @param {number} memberId 
     * @returns {Promise<boolean>} Verdadero si existe una relación en la tabla usuario
     */
    static async hasLinkedUser(memberId) {
        try {
            const [rows] = await db.query(
                "SELECT id_usuario FROM usuario WHERE id_miembro = ? LIMIT 1",
                [memberId]
            );
            return rows.length > 0;
        } catch (error) {
            console.error("Error in Member.hasLinkedUser:", error);
            throw { status: 500, message: "Error al verificar dependencias del miembro." };
        }
    }

    /**
     * Inserta un nuevo miembro en el sistema (por defecto con estado activo)
     * @param {Object} member - Objeto limpio con propiedades en español
     * @returns {Promise<number>} ID autogenerado del nuevo registro
     */
    static async create(member) {
        try {
            const [result] = await db.query(
                `INSERT INTO miembro (nombre, apellido, documento, fecha_registro, fecha_bautismo, activo) 
                 VALUES (?, ?, ?, ?, ?, 1)`,
                [
                    member.nombre || null,
                    member.apellido || null,
                    member.documento || null,
                    member.fecha_registro || null,
                    member.fecha_bautismo || null
                ]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error in Member.create:", error);
            throw { status: 500, message: "Error al registrar el miembro en la base de datos." };
        }
    }

    /**
     * Actualiza la información básica o eclesiástica de un miembro
     * @param {number} memberId - ID único del miembro
     * @param {Object} memberUpdate - Objeto con datos corregidos en español
     */
    static async update(memberId, memberUpdate) {
        try {
            await db.query(
                `UPDATE miembro 
                 SET nombre = ?, apellido = ?, documento = ?, fecha_registro = ?, fecha_bautismo = ? 
                 WHERE id_miembro = ?`,
                [
                    memberUpdate.nombre || null,
                    memberUpdate.apellido || null,
                    memberUpdate.documento || null,
                    memberUpdate.fecha_registro || null,
                    memberUpdate.fecha_bautismo || null,
                    memberId
                ]
            );
        } catch (error) {
            console.error("Error in Member.update:", error);
            throw { status: 500, message: "Error al actualizar la información del miembro." };
        }
    }

    /**
     * Modifica el estado lógico de un miembro en el sistema
     * @param {number} memberId 
     * @param {number} newStatus (1 para Activo, 0 para Inactivo)
     */
    static async updateStatus(memberId, newStatus) {
        try {
            await db.query(
                "UPDATE miembro SET activo = ? WHERE id_miembro = ?",
                [newStatus, memberId]
            );
        } catch (error) {
            console.error("Error in Member.updateStatus:", error);
            throw { status: 500, message: "Error al cambiar el estado del miembro en la base de datos." };
        }
    }

    /**
     * Obtiene métricas consolidadas de la membresía en un solo query para el dashboard
     * @static
     * @async
     * @returns {Promise<Object>} Totales condicionales de miembros activos e inactivos
     */
    static async getDashboardSummary() {
        try {
            const query = `
                SELECT 
                    COUNT(*) AS total,
                    COUNT(CASE WHEN activo = 1 THEN 1 END) AS activos,
                    COUNT(CASE WHEN activo = 0 THEN 1 END) AS inactivos
                FROM miembro
            `;
            const [rows] = await db.query(query);
            return rows[0] || { total: 0, activos: 0, inactivos: 0 };
        } catch (error) {
            console.error("Error en Member.getDashboardSummary:", error);
            throw { status: 500, message: "Error al compilar métricas de membresía." };
        }
    }


    /**
    * Busca el perfil del miembro y todos sus ministerios asociados agrupados usando el ID de usuario en sesión
    * @param {number} userId 
    * @returns {Promise<Object|null>} Datos del miembro con la lista de sus ministerios
    */
    static async findByUserId(userId) {
        try {
            const query = `
            SELECT 
                m.id_miembro, 
                m.nombre, 
                m.apellido, 
                m.documento, 
                m.activo,
                m.fecha_bautismo,
                -- Agrupamos todos los nombres de los ministerios en una sola cadena separada por comas
                GROUP_CONCAT(min.nombre SEPARATOR ', ') AS nombre_ministerio
            FROM usuario u
            INNER JOIN miembro m ON u.id_miembro = m.id_miembro
            LEFT JOIN miembro_ministerio mm ON m.id_miembro = mm.id_miembro
            LEFT JOIN ministerio min ON mm.id_ministerio = min.id_ministerio
            WHERE u.id_usuario = ?
            GROUP BY m.id_miembro
        `;

            const [rows] = await db.query(query, [userId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error en Member.findByUserId:", error);
            throw { status: 500, message: "Error al recuperar el perfil por usuario." };
        }
    }
}

export default Member;