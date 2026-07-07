/**
 * @file LogisticsService.js
 * @description Capa de negocio para la gestión logística con mezcla inteligente de datos parciales.
 */
import Logistica from "../models/Logistica.js";
import Culto from "../models/ServicePlatform.js";

class LogisticsService {
    
    static async getLogisticsData(idCulto) {
        const culto = await Culto.getById(idCulto);
        if (!culto) {
            const error = new Error("El culto solicitado no existe.");
            error.name = "NotFoundError";
            throw error;
        }

        const logistica = await Logistica.getByCultoId(idCulto) || {};
        return { culto, logistica };
    }

    /**
     * Guarda o actualiza de forma segura la logística mezclando datos previos
     */
    static async saveLogisticsData(idCulto, bodyData) {
        // Validamos primero que el culto exista de verdad
        const culto = await Culto.getById(idCulto);
        if (!culto) {
            const error = new Error("No se puede gestionar logística para un culto inexistente.");
            error.name = "NotFoundError";
            throw error;
        }

        // Buscamos si ya tiene un registro de logística en la BD
        const registroActual = await Logistica.getByCultoId(idCulto);

        // Fusión inteligente: Si el campo no viene en el JSON de Postman, preservamos el valor actual de la BD
        const dataLogistica = {
            id_culto: Number(idCulto),
            
            id_sonido: bodyData.id_sonido !== undefined 
                ? (bodyData.id_sonido === null || bodyData.id_sonido === "" ? null : Number(bodyData.id_sonido))
                : (registroActual ? registroActual.id_sonido : null),

            id_multimedia: bodyData.id_multimedia !== undefined 
                ? (bodyData.id_multimedia === null || bodyData.id_multimedia === "" ? null : Number(bodyData.id_multimedia))
                : (registroActual ? registroActual.id_multimedia : null),

            id_aseo: bodyData.id_aseo !== undefined 
                ? (bodyData.id_aseo === null || bodyData.id_aseo === "" ? null : Number(bodyData.id_aseo))
                : (registroActual ? registroActual.id_aseo : null),

            observaciones: bodyData.observaciones !== undefined 
                ? (bodyData.observaciones === null ? null : bodyData.observaciones.trim())
                : (registroActual ? registroActual.observaciones : null)
        };

        await Logistica.save(dataLogistica);
    }

    static async getFullLogisticsCalendar() {
        return await Logistica.getAllWithCultoData();
    }
}

export default LogisticsService;