/**
 * @file MinistryService.js
 * @description Lógica de negocio y control de asignaciones relacionales para los ministerios.
 */
import Ministry from '../models/Ministry.js';
import MemberModel from '../models/Member.js';

class MinistryService {

    static async getMinistriesDashboard() {
        return await Ministry.getAll();
    }

    static async getMinistryDetails(id_ministerio) {
        const ministry = await Ministry.getById(id_ministerio);
        if (!ministry) {
            const error = new Error("El ministerio solicitado no existe.");
            error.name = "NotFoundError";
            throw error;
        }

        const currentMembers = await Ministry.getMembers(id_ministerio);
        const activeMembers = await MemberModel.findAllActive();

        // Remover candidatos que ya integran este ministerio
        const assignableMembers = activeMembers.filter(active =>
            !currentMembers.some(current => current.id_miembro === active.id_miembro)
        );

        return {
            ministry,
            currentMembers,
            assignableMembers
        };
    }

    static async createMinistry(ministryData) {
        return await Ministry.create(ministryData);
    }

    /**
     * Actualiza parcialmente un ministerio cruzando datos existentes
     */
    static async updateMinistry(id, newData) {
        const currentMin = await Ministry.getById(id);
        if (!currentMin) {
            const error = new Error("El ministerio a modificar no existe.");
            error.name = "NotFoundError";
            throw error;
        }

        const dataUpdate = {
            nombre: newData.nombre !== undefined ? newData.nombre.trim() : currentMin.nombre,
            descripcion: newData.descripcion !== undefined ? newData.descripcion.trim() : currentMin.descripcion
        };

        await Ministry.update(id, dataUpdate);
    }

    static async assignMemberToMinistry(id_miembro, id_ministerio) {
        const ministryExists = await Ministry.getById(id_ministerio);
        if (!ministryExists) {
            const error = new Error("El ministerio especificado no existe.");
            error.name = "NotFoundError";
            throw error;
        }

        const alreadyAssigned = await Ministry.isMemberAssigned(id_miembro, id_ministerio);
        if (alreadyAssigned) {
            const error = new Error("El miembro ya se encuentra asignado a este ministerio.");
            error.name = "BusinessValidationError";
            throw error;
        }

        return await Ministry.addMember(id_miembro, id_ministerio);
    }

    static async removeMemberFromMinistry(id_miembro, id_ministerio) {
        const alreadyAssigned = await Ministry.isMemberAssigned(id_miembro, id_ministerio);
        if (!alreadyAssigned) {
            const error = new Error("El miembro no pertenece a este ministerio o ya fue removido.");
            error.name = "BusinessValidationError";
            throw error;
        }
        return await Ministry.removeMember(id_miembro, id_ministerio);
    }
}

export default MinistryService;