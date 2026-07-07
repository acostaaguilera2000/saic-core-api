import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "saic_app",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Sugerencia: añade un tiempo de espera para que no se quede "colgado" si el servidor no responde
    connectTimeout: 10000 
});

/**
 * Prueba de conexión inmediata
 */
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ [DB] Conexión establecida exitosamente con la base de datos 'saic_app'.");
        connection.release(); // Muy importante liberar la conexión de prueba al pool
    } catch (error) {
        console.error("❌ [DB] Error crítico: No se pudo conectar a MySQL.");
        
        // Mensajes específicos según el tipo de error
        if (error.code === 'ECONNREFUSED') {
            console.error("👉 El servidor MySQL parece estar apagado (verifica XAMPP/Wamp).");
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error("👉 Usuario o contraseña de base de datos incorrectos.");
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error("👉 La base de datos 'saic_app' no existe.");
        } else {
            console.error(`👉 Detalle: ${error.message}`);
        }
    }
};

// Ejecutar la prueba
testConnection();

export default pool;