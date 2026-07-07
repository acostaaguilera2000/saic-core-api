import User from "../models/User.js";
import bcrypt from "bcrypt"; 

class UserService {

    /**
     * Lista los usuarios del sistema filtrando la sesión activa y protegiendo cuentas root
     * @param {number} activeSessionId 
     * @returns {Promise<Array>} Lista de usuarios filtrada
     */
    static async getManageableUsers(activeSessionId) {
        const allUsers = await User.findAll();
        return allUsers.filter(user => 
            user.username.toLowerCase() !== 'root' && 
            user.id_usuario !== Number(activeSessionId)
        );
    }

    /**
     * Ejecuta las reglas de negocio para el registro de un nuevo usuario
     * @param {Object} userData 
     */
    static async registerUser(userData) {
        const usernameExists = await User.findByUsername(userData.username.trim());
        if (usernameExists) {
            const businessError = new Error(`El nombre de usuario "${userData.username}" ya está en uso.`);
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        const emailExists = await User.findByEmail(userData.email.trim());
        if (emailExists) {
            const businessError = new Error(`El correo electrónico "${userData.email}" ya se encuentra registrado.`);
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        // Encriptar contraseña para nuevos registros
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const sanitizedUser = {
            username: userData.username.trim(),
            email: userData.email.trim().toLowerCase(),
            password: hashedPassword, 
            rol: userData.rol,
            id_miembro: userData.id_miembro ? Number(userData.id_miembro) : null
        };

        await User.create(sanitizedUser);
    }

    /**
     * Modifica las credenciales y roles de un usuario controlando colisiones de identidad
     * @param {number} userId 
     * @param {Object} newData 
     */
    static async updateAdministrativeUser(userId, newData) {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            const businessError = new Error("El usuario a modificar no existe.");
            businessError.name = "NotFoundError";
            throw businessError;
        }

        // Validar username si cambió
        if (newData.username && newData.username !== currentUser.username) {
            const usernameExists = await User.findByUsername(newData.username.trim());
            if (usernameExists) {
                const businessError = new Error("El nombre de usuario ya pertenece a otra cuenta.");
                businessError.name = "BusinessValidationError";
                throw businessError;
            }
        }

        // Validar email si cambió
        if (newData.email && newData.email !== currentUser.email) {
            const emailExists = await User.findByEmail(newData.email.trim());
            if (emailExists) {
                const businessError = new Error("El correo electrónico ya pertenece a otra cuenta registrada.");
                businessError.name = "BusinessValidationError";
                throw businessError;
            }
        }

        // LÓGICA DE CONTRASEÑA CRÍTICA:
        let finalPassword = currentUser.password; // Por defecto mantenemos la encriptada existente
        
        // Si newData.password existe, no es un string vacío y no contiene puros espacios
        if (newData.password && newData.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            finalPassword = await bcrypt.hash(newData.password, salt);
        }

        // Fusión de datos usando variables seguras
        const updatedUser = {
            username: newData.username || currentUser.username,
            email: newData.email || currentUser.email,
            password: finalPassword, // Contraseña vieja intacta O nueva contraseña encriptada correctamente
            rol: newData.rol || currentUser.rol,
            id_miembro: newData.id_miembro ? Number(newData.id_miembro) : currentUser.id_miembro
        };

        await User.update(updatedUser, userId);
    }

    /**
     * Procesa la eliminación permanente de una cuenta de usuario
     * @param {number} userId 
     */
    static async deleteUserAccount(userId) {
        const user = await User.findById(userId);
        if (!user) {
            const businessError = new Error("La cuenta de usuario que intenta eliminar no existe.");
            businessError.name = "NotFoundError";
            throw businessError;
        }

        await User.deletePhysical(userId);
    }
}

export default UserService;