/**
 * @file ReportService.js
 * @description Capa de negocio para la agregación de datos y filtrado analítico de cronogramas.
 */
import Culto from "../models/ServicePlatform.js";

class ReportService {
    /**
     * Filtra los servicios/cultos por un mes específico para propósitos estadísticos y de auditoría
     * @param {string} month - Número de mes (01-12) o vacío para traer el año completo
     * @param {number} year - Año de análisis actual
     * @returns {Promise<Array>} Lista de cultos filtrada
     */
    static async getServicesByMonth(month, year) {
        // CORRECCIÓN: Invocamos 'listAll(false)' que es la función real en ServicePlatform.js
        const allServices = await Culto.listAll(false); 

        if (!month) return allServices;

        // Filtrado preciso en base a la fecha del servicio
        return allServices.filter(item => {
            if (!item.fecha) return false;
            
            // Convertimos a string por si el driver lo devuelve como un objeto Date de JS
            // Las fechas en SQL suelen venir como YYYY-MM-DD o objetos Date
            let dateStr = "";
            if (item.fecha instanceof Date) {
                // ISO String devuelve YYYY-MM-DDTHH:mm:ss.sssZ, dividimos en la 'T'
                dateStr = item.fecha.toISOString().split("T")[0];
            } else {
                dateStr = String(item.fecha);
            }

            const serviceMonth = dateStr.split("-")[1]; // Extrae el 'MM' [YYYY, MM, DD]
            
            return serviceMonth === month;
        });
    }
}

export default ReportService;