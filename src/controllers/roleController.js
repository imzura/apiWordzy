import Role from '../models/role.js';
import Permission from '../models/permission.js';

export async function getRoles(req, res) {
    try {
        const roles = await Role.find()
            .populate('permissions')

        if (roles.length === 0) {
            return res.status(404).json({ message: 'No hay roles registrados' });
        }
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los roles', error });
    }
}


export async function postRole(req, res) {
    const body = req.body;
    try {
        const role = new Role(body);
        await role.save();

        res.status(201).json({ message: 'Rol creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el rol', error });
    }
}

export async function putRole(req, res) {
    try {
        const { name, description, permissions, status } = req.body; // Datos a actualizar

        const updatedRole = await Role.findByIdAndUpdate(req.params.id,
        { name, description, permissions, status },
        { new: true }
        ).populate('permissions');

        if (!updatedRole) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.status(200).json({ message: 'Rol actualizado exitosamente', updatedRole });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol', error });
    }
}

export async function deleteRole(req, res) {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);

        if (!deletedRole) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol', error });
    }
}