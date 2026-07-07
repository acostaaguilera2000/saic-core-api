import Member from '../models/Member.js';
import Finance from '../models/Finance.js';
import ServicePlatform from '../models/ServicePlatform.js';
import User from '../models/User.js';

/**
 * Servicio orquestador encargado de unificar y estructurar las métricas de los bloques Bento
 * @class DashboardService
 */
class DashboardService {

    /**
     * Compila y unifica toda la información dinámica requerida por el Dashboard administrativo (Admin/Líder)
     * @static
     * @async
     * @param {number} currentYear - Año del cual se extraerán las métricas financieras (Ej: 2026)
     * @returns {Promise<Object>} Estructura unificada de métricas globales
     */
    static async getBentoGridData(currentYear = 2026) {
        try {
            // CORRECCIÓN: Usamos 'listAll(true)' que es la función real en ServicePlatform.js para traer la agenda futura
            const [memberSummary, rawMonthlyFinances, recentUsers, allUpcomingEvents] = await Promise.all([
                Member.getDashboardSummary(),
                Finance.getMonthlyDonationsSumByYear(currentYear),
                User.getLatestUsersCreated(3),
                ServicePlatform.listAll(true) 
            ]);

            // Limitamos a los 2 eventos más próximos para no saturar el Bento Grid de la API
            const upcomingEvents = Array.isArray(allUpcomingEvents) ? allUpcomingEvents.slice(0, 2) : [];

            // Inicializamos un array de 12 posiciones en 0 para asegurar que los meses vacíos tengan datos en los charts
            const chartDataArray = new Array(12).fill(0);
            rawMonthlyFinances.forEach(item => {
                const index = item.mes - 1; // Ajustamos mes (1-12) a índice array (0-11)
                if (index >= 0 && index < 12) {
                    chartDataArray[index] = parseFloat(item.total_mes || 0);
                }
            });

            return {
                metricasGlobales: memberSummary,
                graficoFinanzasAnual: chartDataArray,
                ultimosUsuarios: recentUsers,
                proximosCultos: upcomingEvents
            };
        } catch (error) {
            console.error("Error en DashboardService.getBentoGridData:", error);
            throw { status: 500, message: "Error al consolidar las métricas globales del sistema." };
        }
    }

    /**
     * Recupera el estado del perfil de un miembro común y sus responsabilidades de servicio próximas
     */
    static async getMemberDashboardSummary(userId) {
        // ... (Tu método getMemberDashboardSummary permanece idéntico)
        try {
            const currentMember = await Member.findByUserId(userId);
            if (!currentMember) return null;

            const myAssignments = await ServicePlatform.findActiveTurnsByMemberId(currentMember.id_miembro);

            const formattedAssignments = myAssignments.map(turno => {
                let fechaFormateada = turno.fecha;
                let horaFormateada = turno.hora;

                if (turno.fecha instanceof Date) {
                    fechaFormateada = turno.fecha.toISOString().split('T')[0];
                }

                if (typeof turno.hora === 'string' && turno.hora.includes(':')) {
                    const [horas, minutos] = turno.hora.split(':');
                    horaFormateada = `${horas}:${minutos}`;
                }

                return {
                    ...turno,
                    fecha: fechaFormateada,
                    hora: horaFormateada
                };
            });

            return {
                perfil: {
                    id_miembro: currentMember.id_miembro,
                    nombre: currentMember.nombre,
                    apellido: currentMember.apellido,
                    documento: currentMember.documento,
                    fecha_bautismo: currentMember.fecha_bautismo,
                    estado: (currentMember.activo == 1 || currentMember.activo === true) ? 'Activo' : 'Inactivo',
                    ministerio: currentMember.nombre_ministerio || 'Ninguno asignado'
                },
                misProximosTurnos: formattedAssignments
            };
        } catch (error) {
            console.error("Error en DashboardService.getMemberDashboardSummary:", error);
            throw { status: 500, message: "Error al compilar el sumario del portal de miembro." };
        }
    }
}

export default DashboardService;