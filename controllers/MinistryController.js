/**
 * @file MinistryController.js
 * @description Controlador API RESTful para la administración de ministerios de la iglesia.
 */
import MinistryService from "../services/MinistryService.js";

class MinistryController {

    // GET /api/ministries
    static async getAllMinistries(req, res) {
        try {
            const ministries = await MinistryService.getMinistriesDashboard();
            return res.status(200).json({ status: "success", data: ministries });
        } catch (err) {
            console.error("Error en MinistryController.getAllMinistries:", err);
            return res.status(500).json({ status: "error", error: "No se pudo recuperar la lista de ministerios." });
        }
    }

    // GET /api/ministries/:id
    static async getMinistryDetails(req, res) {
        try {
            const { id } = req.params;
            const details = await MinistryService.getMinistryDetails(Number(id));
            return res.status(200).json({ status: "success", data: details });
        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({ status: "error", error: err.message });
            }
            console.error("Error en MinistryController.getMinistryDetails:", err);
            return res.status(500).json({ status: "error", error: "Error interno al recuperar los detalles del ministerio." });
        }
    }

    // POST /api/ministries
    static async processCreateMinistry(req, res) {
        try {
            await MinistryService.createMinistry(req.body);
            return res.status(201).json({ status: "success", message: "Ministerio creado exitosamente." });
        } catch (err) {
            console.error("Error in MinistryController.processCreateMinistry:", err);
            return res.status(500).json({ status: "error", error: "Error al intentar crear el ministerio." });
        }
    }

    // PUT /api/ministries/:id
    static async processUpdateMinistry(req, res) {
        try {
            const { id } = req.params;
            await MinistryService.updateMinistry(Number(id), req.body);
            return res.status(200).json({ status: "success", message: "Ministerio modificado correctamente." });
        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({ status: "error", error: err.message });
            }
            console.error("Error en MinistryController.processUpdateMinistry:", err);
            return res.status(500).json({ status: "error", error: "Error al intentar actualizar el ministerio." });
        }
    }

    // POST /api/ministries/:id/members/:memberId (Asociación atómica)
    static async processAddMember(req, res) {
        const { id, memberId } = req.params;
        try {
            await MinistryService.assignMemberToMinistry(Number(memberId), Number(id));
            return res.status(200).json({ status: "success", message: "Miembro asignado al ministerio correctamente." });
        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error in MinistryController.processAddMember:", err);
            return res.status(500).json({ status: "error", error: "Error interno al asignar el miembro." });
        }
    }

    // DELETE /api/ministries/:id/members/:memberId (Desvinculación atómica)
    static async processRemoveMember(req, res) {
        const { id, memberId } = req.params;
        try {
            await MinistryService.removeMemberFromMinistry(Number(memberId), Number(id));
            return res.status(200).json({ status: "success", message: "Miembro desvinculado del ministerio correctamente." });
        } catch (err) {
            if (err.name === "BusinessValidationError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error in MinistryController.processRemoveMember:", err);
            return res.status(500).json({ status: "error", error: "No se pudo desvincular al miembro." });
        }
    }
}

export default MinistryController;