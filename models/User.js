import db from "../config/db.js";

class User {

    /**
     * Recupera el listado completo de usuarios con sus datos de miembro asociados
     * @returns {Promise<Array>} Lista de usuarios
     */
    static async findAll() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    u.id_usuario,
                    u.username,
                    u.email,
                    u.rol,
                    u.id_miembro,
                    m.nombre,
                    m.apellido,
                    m.documento,
                    m.activo
                FROM usuario u
                LEFT JOIN miembro m ON u.id_miembro = m.id_miembro
                ORDER BY u.username ASC
            `);
            return rows || [];
        } catch (error) {
            console.error("Error in User.findAll:", error);
            throw { status: 500, message: "Error al listar los usuarios del sistema." };
        }
    }

    /**
     * Busca un usuario específico por su identificador único (Primary Key)
     * @param {number} userId 
     * @returns {Promise<Object|null>} Objeto usuario o null si no se encuentra
     */
    static async findById(userId) {
        try {
            const [rows] = await db.query(`
                SELECT u.*, 
                       m.nombre AS nombre_miembro, 
                       m.apellido AS apellido_miembro
                FROM usuario u
                LEFT JOIN miembro m ON u.id_miembro = m.id_miembro
                WHERE u.id_usuario = ?`,
                [userId]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in User.findById:", error);
            throw { status: 500, message: "Error al obtener usuario por ID" };
        }
    }

    /**
     * Busca un usuario por su dirección de correo electrónico
     * @param {string} email 
     * @returns {Promise<Object|null>} Objeto usuario o null
     */
    static async findByEmail(email) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM usuario WHERE email = ? LIMIT 1",
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in User.findByEmail:", error);
            throw { status: 500, message: "Error al obtener el usuario por email." };
        }
    }

    /**
     * Busca un usuario por su nombre de usuario único
     * @param {string} username 
     * @returns {Promise<Object|null>} Objeto usuario o null
     */
    static async findByUsername(username) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM usuario WHERE username = ? LIMIT 1",
                [username]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in User.findByUsername:", error);
            throw { status: 500, message: "Error al buscar usuario por username." };
        }
    }

    /**
     * Registra un nuevo usuario en la base de datos
     * @param {Object} user 
     */
    static async create(user) {
        try {
            await db.query(
                "INSERT INTO usuario (email, password, rol, username, id_miembro) VALUES (?, ?, ?, ?, ?)",
                [user.email, user.password, user.rol, user.username, user.id_miembro || null]
            );
        } catch (error) {
            console.error("Error in User.create:", error);
            throw { status: 500, message: "Error al insertar el usuario en la base de datos." };
        }
    }

    /**
     * Actualiza la información administrativa y de credenciales de un usuario
     * @param {Object} userUpdate 
     * @param {number} userId 
     */
    static async update(userUpdate, userId) {
        try {
            await db.query(`
                UPDATE usuario 
                SET email = ?, password = ?, rol = ?, username = ?, id_miembro = ? 
                WHERE id_usuario = ?`,
                [
                    userUpdate.email,
                    userUpdate.password,
                    userUpdate.rol,
                    userUpdate.username,
                    userUpdate.id_miembro || null,
                    userId
                ]
            );
        } catch (error) {
            console.error("Error in User.update:", error);
            throw { status: 500, message: "Error al actualizar las credenciales del usuario." };
        }
    }

    /**
     * Realiza una eliminación física del usuario en la base de datos
     * @param {number} userId 
     */
    static async deletePhysical(userId) {
        try {
            await db.query("DELETE FROM usuario WHERE id_usuario = ?", [userId]);
        } catch (error) {
            console.error("Error in User.deletePhysical:", error);
            throw { status: 500, message: "Error al eliminar el usuario de la base de datos." };
        }
    }

    /**
     * Permite la actualización parcial del perfil autónomo ("Mi Cuenta")
     * @param {string} username 
     * @param {string|null} password Contraseña ya encriptada con hash, o null si no se altera
     * @param {number} userId 
     */
    static async updateSelfProfile(username, hashedNewPassword, id_usuario) {
        if (hashedNewPassword) {
            // Si el usuario cambió su contraseña, actualizamos ambos campos
            const query = `UPDATE usuario SET username = ?, password = ? WHERE id_usuario = ?`;
            return await db.query(query, [username, hashedNewPassword, id_usuario]);
        } else {
            // Si no envió una nueva contraseña, solo modificamos el nombre de usuario
            const query = `UPDATE usuario SET username = ? WHERE id_usuario = ?`;
            return await db.query(query, [username, id_usuario]);
        }
    }

    /**
     * Obtiene los últimos usuarios dados de alta en la plataforma web cruzados con sus datos de miembro
     * @static
     * @async
     * @param {number} limit - Cantidad de usuarios a listar
     * @returns {Promise<Array>} Datos de usuarios recientes y sus comités/ministerios
     */
    static async getLatestUsersCreated(limit = 3) {
        try {
            const query = `
                SELECT 
                    u.id_usuario,
                    u.username,
                    CONCAT(m.nombre, ' ', m.apellido) AS nombre_completo,
                    m.id_miembro
                FROM usuario u
                INNER JOIN miembro m ON u.id_miembro = m.id_miembro
                ORDER BY u.id_usuario DESC
                LIMIT ?
            `;
            const [rows] = await db.query(query, [limit]);
            return rows;
        } catch (error) {
            console.error("Error en User.getLatestUsersCreated:", error);
            throw { status: 500, message: "Error al recuperar los usuarios de alta reciente." };
        }
    }
}

export default User;