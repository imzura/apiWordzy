import Role from '../models/role.js';
import Permission from '../models/permission.js';

export async function getRoles(req, res) {
    try {
        const roles = await Role.find()
            .populate('permissions')
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los roles', error });
    }
}

export async function postRole(req, res) {
  const { name, description, permissions, status } = req.body

  try {
    // Validar que el nombre no exista
    const existingRole = await Role.findOne({ name })
    if (existingRole) {
      return res.status(400).json({ message: "Ya existe un rol con ese nombre" })
    }

    // Procesar y validar permisos
    let processedPermissions = []

    if (permissions && permissions.length > 0) {
      // Extraer los IDs de permisos para validar que existan
      const permissionIds = permissions.map((p) => p.permissionId || p.permission)

      const existingPermissions = await Permission.find({
        _id: { $in: permissionIds },
      })

      if (existingPermissions.length !== permissionIds.length) {
        return res.status(400).json({ message: "Uno o más permisos no existen" })
      }

      // Formatear permisos para el modelo
      processedPermissions = permissions.map((perm) => ({
        permission: perm.permissionId || perm.permission,
        canView: perm.canView || false,
        canCreate: perm.canCreate || false,
        canEdit: perm.canEdit || false,
        canDelete: perm.canDelete || false,
      }))
    }

    const role = new Role({
      name,
      description,
      permissions: processedPermissions,
      status: status !== undefined ? status : true,
    })

    const savedRole = await role.save()

    // Poblar el rol guardado para la respuesta
    const populatedRole = await Role.findById(savedRole._id).populate("permissions.permission")

    res.status(201).json({
      message: "Rol creado correctamente",
      role: populatedRole,
    })
  } catch (error) {
    console.error("Error al crear el rol:", error)
    res.status(500).json({
      message: "Error al crear el rol",
      error: error.message,
    })
  }
}

export async function putRole(req, res) {
  try {
    const { name, description, permissions, status } = req.body

    // Procesar permisos si se proporcionan
    let processedPermissions = []

    if (permissions && permissions.length > 0) {
      const permissionIds = permissions.map((p) => p.permissionId || p.permission)

      const existingPermissions = await Permission.find({
        _id: { $in: permissionIds },
      })

      if (existingPermissions.length !== permissionIds.length) {
        return res.status(400).json({ message: "Uno o más permisos no existen" })
      }

      processedPermissions = permissions.map((perm) => ({
        permission: perm.permissionId || perm.permission,
        canView: perm.canView || false,
        canCreate: perm.canCreate || false,
        canEdit: perm.canEdit || false,
        canDelete: perm.canDelete || false,
      }))
    }

    const updateData = {
      name,
      description,
      permissions: processedPermissions,
      status,
    }

    const updatedRole = await Role.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate(
      "permissions.permission",
    )

    if (!updatedRole) {
      return res.status(404).json({ message: "Rol no encontrado" })
    }

    res.status(200).json({
      message: "Rol actualizado exitosamente",
      role: updatedRole,
    })
  } catch (error) {
    console.error("Error al actualizar el rol:", error)
    res.status(500).json({
      message: "Error al actualizar el rol",
      error: error.message,
    })
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