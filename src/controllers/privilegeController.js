import Privilege from '../models/privilege.js';

export async function getPrivileges(req, res) {
    try {
        const privileges = await Privilege.find();

        if (privileges.length === 0) {
            return res.status(404).json({ message: 'No hay privilegios registrados' });
        }

        res.status(200).json(privileges);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los privilegios', error });
    }
}

export async function postPrivilege(req, res) {
    const body = req.body;
    try {
        const privilege = new Privilege(body);
        await privilege.save();

        res.status(201).json({ message: 'Privilegio creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el privilegio', error });
    }
}

export async function putPrivilege(req, res) {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL
    const body = req.body; // Datos a actualizar

    try {
        const updatedPrivilege = await Privilege.findByIdAndUpdate(id, body, { new: true });

        if (!updatedPrivilege) {
            return res.status(404).json({ message: 'Privilegio no encontrado' });
        }

        res.status(200).json({ message: 'Privilegio actualizado exitosamente', updatedPrivilege });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el privilegio', error });
    }
}

export async function deletePrivilege(req, res) {
    const { id } = req.params;

    try {
        const deletedPrivilege = await Privilege.findByIdAndDelete(id);

        if (!deletedPrivilege) {
            return res.status(404).json({ message: 'Privilegio no encontrado' });
        }

        res.status(200).json({ message: 'Privilegio eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el privilegio', error });
    }
}
