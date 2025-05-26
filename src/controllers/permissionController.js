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
    try {
    const { module, canView, canCreate, canEdit, canDelete } = req.body;
    
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      { module, canView, canCreate, canEdit, canDelete },
      { new: true }
    );

    if (!permission) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }
    res.json(permission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export async function deletePermission(req, res) {
    try {
        const deletedPermission = await Permission.findByIdAndDelete(req.params.id);
        // Verificar si se encontró el permiso
        if (!deletedPermission) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        res.status(200).json({ message: 'Permiso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el permiso', error });
    }
}
