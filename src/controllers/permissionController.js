import Permission from '../models/permission.js';

export async function getPermissions(req, res) {
    try {
        const permissions = await Permission.find();

        if (permissions.length === 0) {
            return res.status(404).json({ message: 'No hay permisos registrados' });
        }

        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los permisos', error });
    }
}

export async function postPermission(req, res) {
    const body = req.body;
    try {
        const permission = new Permission(body);
        await permission.save();

        res.status(201).json({ message: 'Permiso creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el permiso', error });
    }
}

export async function putPermission(req, res) {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL
    const body = req.body; // Datos a actualizar

    try {
        const updatedPermission = await Permission.findByIdAndUpdate(id, body, { new: true });

        if (!updatedPermission) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        res.status(200).json({ message: 'Permiso actualizado exitosamente', updatedPermission });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el permiso', error });
    }
}


export async function deletePermission(req, res) {
    const { id } = req.params;

    try {
        const deletedPermission = await Permission.findByIdAndDelete(id);

        if (!deletedPermission) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        res.status(200).json({ message: 'Permiso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el permiso', error });
    }
}
