/**
 * @file MemberController.js
 * @description Controlador RESTful para la administración del censo de miembros.
 */
import Member from "../models/Member.js";
import MemberService from "../services/MemberService.js";

class MemberController {

    // GET /api/members
    static async getAllMembers(req, res) {
        try {
            const members = await Member.findAll();
            return res.status(200).json({
                status: "success",
                data: members
            });
        } catch (err) {
            console.error("Error in MemberController.getAllMembers:", err);
            return res.status(500).json({ status: "error", error: "No se pudo recuperar la lista de miembros." });
        }
    }

    // POST /api/members
    static async processCreateMember(req, res) {
        try {
            await MemberService.createNewMember(req.body);

            return res.status(201).json({
                status: "success",
                message: "Miembro registrado exitosamente en el censo."
            });
        } catch (err) {
            if (err.name === "BusinessValidationError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error in MemberController.processCreateMember:", err);
            return res.status(500).json({ status: "error", error: "Error inesperado al registrar el miembro." });
        }
    }

    // GET /api/members/:id
    static async renderEditForm(req, res) {
        try {
            const { id } = req.params;
            const member = await Member.findById(id);

            if (!member) {
                return res.status(404).json({ status: "error", error: "El miembro especificado no existe." });
            }

            return res.status(200).json({
                status: "success",
                data: member
            });
        } catch (err) {
            console.error("Error in MemberController.renderEditForm:", err);
            return res.status(500).json({ status: "error", error: "Error al recuperar los datos del miembro." });
        }
    }

    // PUT /api/members/:id
    static async processUpdateMember(req, res) {
        try {
            const { id } = req.params;
            
            // CORRECCIÓN: Llamamos al método correcto '.update' expuesto en tu capa de servicios
            await MemberService.update(id, req.body);

            return res.status(200).json({
                status: "success",
                message: "Registro del miembro actualizado correctamente."
            });
        } catch (err) {
            if (err.name === "BusinessValidationError" || err.name === "NotFoundError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error in MemberController.processUpdateMember:", err);
            return res.status(500).json({ status: "error", error: "Error interno al intentar actualizar el miembro." });
        }
    }

    // PATCH /api/members/:id/toggle-status
    static async toggleMemberStatus(req, res) {
        try {
            const { id } = req.params;

            // CORRECCIÓN: Delegamos la lógica completa al servicio para respetar las reglas de negocio y restricciones
            const result = await MemberService.toggleStatus(id);

            return res.status(200).json({
                status: "success",
                message: `Estado del miembro [${result.fullName}] actualizado con éxito.`,
                data: { 
                    id_miembro: id, 
                    activo: result.newStatus 
                }
            });

        } catch (err) {
            if (err.name === "NotFoundError") {
                return res.status(404).json({ status: "error", error: err.message });
            }
            if (err.name === "DependencyConstraintError") {
                return res.status(400).json({ status: "error", error: err.message });
            }
            console.error("Error in MemberController.toggleMemberStatus:", err);
            return res.status(500).json({ status: "error", error: "No se pudo alterar el estado de activación del miembro." });
        }
    }
}

export default MemberController;