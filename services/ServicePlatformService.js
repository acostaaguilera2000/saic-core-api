import Culto from "../models/ServicePlatform.js";

class ServicePlatformService {

    static async getAllServices(upcomingOnly = false) {
        return await Culto.listAll(upcomingOnly);
    }

    static async getServiceById(id) {
        const culto = await Culto.getById(id);
        if (!culto) {
            const error = new Error("El culto solicitado no existe en el sistema.");
            error.name = "NotFoundError";
            throw error;
        }
        return culto;
    }

    /**
 * Registra uno o múltiples cultos en la base de datos
 */
static async registerService(bodyData) {
    // Normalizar entrada: Si envían un objeto directo, lo envolvemos en un array dentro de 'cultos'
    let cultos = bodyData.cultos;

    if (!cultos && bodyData.tipo_culto) {
        cultos = [bodyData]; // Si enviaron solo un objeto { tipo_culto, fecha, ... }
    }

    if (!cultos || !Array.isArray(cultos) || cultos.length === 0) {
        const error = new Error("No se recibieron servicios válidos para programar.");
        error.name = "BusinessValidationError";
        throw error;
    }

    const recordsToInsert = cultos.map(item => {
        const id_dirigente = item.id_dirigente ? Number(item.id_dirigente) : null;
        const id_predicador = item.id_predicador ? Number(item.id_predicador) : null;

        return [
            item.fecha,
            item.hora,
            item.tipo_culto ? item.tipo_culto.trim() : "",
            id_dirigente,
            id_dirigente ? null : (item.dirigente_externo ? item.dirigente_externo.trim() : null),
            id_predicador,
            id_predicador ? null : (item.predicador_externo ? item.predicador_externo.trim() : null)
        ];
    });

    await Culto.createMassive(recordsToInsert);
}

    /**
      * Modifica los datos de un culto existente (Edición individual - REST compatible)
      */
    static async updateServiceInfo(id, serviceData) {
        // 1. Recuperamos el estado actual del culto en la Base de Datos
        const currentCulto = await this.getServiceById(id);

        // 2. Evaluamos de forma independiente qué campos envió el cliente en el JSON
        const fecha = serviceData.fecha !== undefined ? serviceData.fecha : currentCulto.fecha;
        const hora = serviceData.hora !== undefined ? serviceData.hora : currentCulto.hora;
        const tipo_culto = serviceData.tipo_culto !== undefined ? serviceData.tipo_culto.trim() : currentCulto.tipo_culto;

        // 3. Resolución lógica para el Dirigente (Interno o Externo)
        let id_dirigente = currentCulto.id_dirigente;
        let dirigente_externo = currentCulto.dirigente_externo;

        // Si explícitamente se envía un id_dirigente local válido
        if (serviceData.id_dirigente !== undefined) {
            id_dirigente = serviceData.id_dirigente || null;
            // Si hay un ID local, el externo obligatoriamente debe quedar en null
            if (id_dirigente !== null) dirigente_externo = null;
        }

        // Si explícitamente se envía una actualización del nombre externo
        if (serviceData.dirigente_externo !== undefined) {
            dirigente_externo = serviceData.dirigente_externo ? serviceData.dirigente_externo.trim() : null;
            // Si hay un nombre externo, el ID local debe quedar en null
            if (dirigente_externo !== null) id_dirigente = null;
        }

        // 4. Resolución lógica para el Predicador (Interno o Externo)
        let id_predicador = currentCulto.id_predicador;
        let predicador_externo = currentCulto.predicador_externo;

        if (serviceData.id_predicador !== undefined) {
            id_predicador = serviceData.id_predicador || null;
            if (id_predicador !== null) predicador_externo = null;
        }

        if (serviceData.predicador_externo !== undefined) {
            predicador_externo = serviceData.predicador_externo ? serviceData.predicador_externo.trim() : null;
            if (predicador_externo !== null) id_predicador = null;
        }

        // 5. Construimos el payload perfectamente saneado y cruzado
        const cultoUpdate = {
            fecha,
            hora,
            tipo_culto,
            id_dirigente,
            dirigente_externo,
            id_predicador,
            predicador_externo
        };

        // 6. Envía el bloque limpio al modelo para impactar la BD
        await Culto.update(id, cultoUpdate);
    }
    
    static async removeService(id) {
        await this.getServiceById(id);
        await Culto.delete(id);
    }
}

export default ServicePlatformService;