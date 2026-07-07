import Member from "../models/Member.js";

class MemberService {
    
    static async createNewMember(memberData) {
        const { documento } = memberData;

        if (!documento || documento.trim() === "") {
            const businessError = new Error("El documento de identidad es un campo obligatorio.");
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        const duplicateMembers = await Member.findByDocument(documento.trim());
        if (duplicateMembers && duplicateMembers.length > 0) {
            const businessError = new Error(`El documento de identidad "${documento}" ya se encuentra registrado.`);
            businessError.name = "BusinessValidationError";
            throw businessError;
        }

        const sanitizedMember = {
            nombre: memberData.nombre ? memberData.nombre.trim() : "",
            apellido: memberData.apellido ? memberData.apellido.trim() : "",
            documento: documento.trim(),
            fecha_registro: memberData.fecha_registro || null,
            fecha_bautismo: memberData.fecha_bautismo || null
        };

        await Member.create(sanitizedMember);
    }

    static async update(memberId, newData) {
        const currentMember = await Member.findById(memberId);
        if (!currentMember) {
            const businessError = new Error("El miembro que intenta actualizar no existe en el sistema.");
            businessError.name = "NotFoundError";
            throw businessError;
        }

        if (newData.documento && newData.documento.trim() !== currentMember.documento) {
            const duplicate = await Member.findByDocument(newData.documento.trim());
            if (duplicate && duplicate.length > 0) {
                const businessError = new Error(`No se puede actualizar el registro: El documento de identidad "${newData.documento}" ya pertenece a otro miembro.`);
                businessError.name = "BusinessValidationError";
                throw businessError;
            }
        }

        const updatedData = {
            nombre: newData.nombre !== undefined ? newData.nombre.trim() : currentMember.nombre,
            apellido: newData.apellido !== undefined ? newData.apellido.trim() : currentMember.apellido,
            documento: newData.documento !== undefined ? newData.documento.trim() : currentMember.documento,
            fecha_registro: newData.fecha_registro !== undefined ? newData.fecha_registro : currentMember.fecha_registro,
            fecha_bautismo: newData.fecha_bautismo !== undefined ? newData.fecha_bautismo : currentMember.fecha_bautismo
        };

        await Member.update(memberId, updatedData);
    }

    static async toggleStatus(memberId) {
        const member = await Member.findById(memberId);
        if (!member) {
            const businessError = new Error("El miembro especificado no existe.");
            businessError.name = "NotFoundError";
            throw businessError;
        }

        if (member.activo === 1) { 
            const hasActiveUser = await Member.hasLinkedUser(memberId); 
            if (hasActiveUser) {
                const businessError = new Error("No se puede inactivar al miembro porque tiene una cuenta de usuario vinculada activa.");
                businessError.name = "DependencyConstraintError";
                throw businessError;
            }
        }

        const newStatus = member.activo === 1 ? 0 : 1;
        await Member.updateStatus(memberId, newStatus);

        return {
            newStatus,
            fullName: `${member.nombre} ${member.apellido}`
        };
    }
}

export default MemberService;