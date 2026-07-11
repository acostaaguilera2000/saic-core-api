import db from '../config/db.js';

class Ministry {
    /**
     * Obtiene todos los ministerios registrados en el sistema
     * @returns {Promise<Array>} Lista de ministerios ordenados alfabéticamente
     */
    static async getAll() {
        const query = `
        SELECT 
            m.id_ministerio, 
            m.nombre, 
            m.descripcion,
            COUNT(mm.id_miembro) AS total_miembros
        FROM ministerio m
        LEFT JOIN miembro_ministerio mm ON m.id_ministerio = mm.id_ministerio
        GROUP BY m.id_ministerio, m.nombre, m.descripcion
        ORDER BY m.nombre ASC
    `;
        const [rows] = await db.query(query);
        return rows;
    }

    /**
     * Obtiene un ministerio específico por su identificador único
     * @param {number} id_ministerio - Identificador del ministerio
     * @returns {Promise<Object|null>} Datos del ministerio o null si no existe
     */
    static async getById(id_ministerio) {
        const query = `SELECT id_ministerio, nombre, descripcion FROM ministerio WHERE id_ministerio = ?`;
        const [rows] = await db.query(query, [id_ministerio]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Inserta un nuevo registro de ministerio en la base de datos
     * @param {Object} data - Objeto con los campos nombre y descripcion
     * @returns {Promise<Object>} Resultado de la ejecución de la consulta SQL
     */
    static async create(data) {
        const { nombre, descripcion } = data;
        const query = `INSERT INTO ministerio (nombre, descripcion) VALUES (?, ?)`;
        const [result] = await db.query(query, [nombre, descripcion]);
        return result;
    }

    /**
     * NUEVO MÉTODO: Actualiza los datos de un ministerio existente en la BD
     * @param {number} id_ministerio - ID del ministerio a modificar
     * @param {Object} data - Datos saneados (nombre, descripcion) provenientes del servicio
     * @returns {Promise<Object>} Resultado del query
     */
    static async update(id_ministerio, data) {
        const { nombre, descripcion } = data;
        const query = `
            UPDATE ministerio 
            SET nombre = ?, 
                descripcion = ? 
            WHERE id_ministerio = ?
        `;
        const [result] = await db.query(query, [nombre, descripcion, id_ministerio]);
        return result;
    }

    /**
     * Recupera los miembros activos vinculados a un ministerio específico
     * @param {number} id_ministerio - Identificador del ministerio
     * @returns {Promise<Array>} Lista de miembros asignados
     */
    static async getMembers(id_ministerio) {
        const query = `
            SELECT m.id_miembro, m.nombre, m.apellido
            FROM miembro_ministerio mm
            INNER JOIN miembro m ON mm.id_miembro = m.id_miembro
            WHERE mm.id_ministerio = ? AND m.activo = 1
            ORDER BY m.apellido, m.nombre ASC
        `;
        const [rows] = await db.query(query, [id_ministerio]);
        return rows;
    }

    /**
     * Verifica la existencia previa de una relación entre un miembro y un ministerio
     * @param {number} id_miembro - Identificador del miembro
     * @param {number} id_ministerio - Identificador del ministerio
     * @returns {Promise<boolean>} Verdadero si ya existe la asignación, falso si no
     */
    static async isMemberAssigned(id_miembro, id_ministerio) {
        const query = `SELECT 1 FROM miembro_ministerio WHERE id_miembro = ? AND id_ministerio = ?`;
        const [rows] = await db.query(query, [id_miembro, id_ministerio]);
        return rows.length > 0;
    }

    /**
     * Crea un vínculo relacional entre un miembro y un ministerio
     * @param {number} id_miembro - Identificador del miembro
     * @param {number} id_ministerio - Identificador del ministerio
     * @returns {Promise<Object>} Resultado de la inserción
     */
    static async addMember(id_miembro, id_ministerio) {
        const query = `INSERT INTO miembro_ministerio (id_miembro, id_ministerio) VALUES (?, ?)`;
        const [result] = await db.query(query, [id_miembro, id_ministerio]);
        return result;
    }

    /**
     * Elimina el vínculo relacional entre un miembro y un ministerio
     * @param {number} id_miembro - Identificador del miembro
     * @param {number} id_ministerio - Identificador del ministerio
     * @returns {Promise<Object>} Resultado de la eliminación
     */
    static async removeMember(id_miembro, id_ministerio) {
        const query = `DELETE FROM miembro_ministerio WHERE id_miembro = ? AND id_ministerio = ?`;
        const [result] = await db.query(query, [id_miembro, id_ministerio]);
        return result;
    }
}

export default Ministry;