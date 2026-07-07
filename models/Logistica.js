import db from "../config/db.js";

class Logistica {
    // Obtener la logística de un culto específico (si no existe, retornará null)
    static async getByCultoId(id_culto) {
        try {
            const query = `
                SELECT 
                    l.*,
                    m_son.nombre AS son_nom, m_son.apellido AS son_ape,
                    m_mul.nombre AS mul_nom, m_mul.apellido AS mul_ape,
                    m_ase.nombre AS ase_nom, m_ase.apellido AS ase_ape
                FROM logistica_culto l
                LEFT JOIN miembro m_son ON l.id_sonido = m_son.id_miembro
                LEFT JOIN miembro m_mul ON l.id_multimedia = m_mul.id_miembro
                LEFT JOIN miembro m_ase ON l.id_aseo = m_ase.id_miembro
                WHERE l.id_culto = ?
            `;
            const [rows] = await db.query(query, [id_culto]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error en Logistica.getByCultoId:", error);
            throw { status: 500, message: "Error al recuperar los datos logísticos." };
        }
    }

    // Guardar o actualizar la logística (UPSERT manual)
    static async save(logistica) {
        try {
            // Verificamos primero si ya existe una logística asignada a este culto
            const existe = await this.getByCultoId(logistica.id_culto);

            if (existe) {
                // Si existe, actualizamos
                const query = `
                    UPDATE logistica_culto 
                    SET id_sonido = ?, id_multimedia = ?, id_aseo = ?, observaciones = ?
                    WHERE id_culto = ?
                `;
                await db.query(query, [
                    logistica.id_sonido || null,
                    logistica.id_multimedia || null,
                    logistica.id_aseo || null,
                    logistica.observaciones || null,
                    logistica.id_culto
                ]);
            } else {
                // Si no existe, insertamos un registro nuevo
                const query = `
                    INSERT INTO logistica_culto (id_culto, id_sonido, id_multimedia, id_aseo, observaciones)
                    VALUES (?, ?, ?, ?, ?)
                `;
                await db.query(query, [
                    logistica.id_culto,
                    logistica.id_sonido || null,
                    logistica.id_multimedia || null,
                    logistica.id_aseo || null,
                    logistica.observaciones || null
                ]);
            }
        } catch (error) {
            console.error("Error en Logistica.save:", error);
            throw { status: 500, message: "Error al procesar la información logística en la base de datos." };
        }
    }

   // Obtener todos los cultos con sus datos logísticos (Solo futuros/actuales)
    static async getAllWithCultoData() {
        try {
            const query = `
                SELECT 
                    c.id_culto,
                    c.fecha,
                    c.hora,
                    c.tipo_culto,
                    l.observaciones,
                    m_son.nombre AS son_nom, m_son.apellido AS son_ape,
                    m_mul.nombre AS mul_nom, m_mul.apellido AS mul_ape,
                    m_ase.nombre AS ase_nom, m_ase.apellido AS ase_ape
                FROM culto c
                LEFT JOIN logistica_culto l ON c.id_culto = l.id_culto
                LEFT JOIN miembro m_son ON l.id_sonido = m_son.id_miembro
                LEFT JOIN miembro m_mul ON l.id_multimedia = m_mul.id_miembro
                LEFT JOIN miembro m_ase ON l.id_aseo = m_ase.id_miembro
                WHERE c.fecha >= CURDATE()
                ORDER BY c.fecha ASC, c.hora ASC
            `;
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Error en Logistica.getAllWithCultoData:", error);
            throw { status: 500, message: "Error al recuperar el historial logístico general." };
        }
    }
}

export default Logistica;