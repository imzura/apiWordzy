import Role from '../models/role.js';
import Permission from '../models/permission.js';
import Privilege from '../models/privilege.js';

export async function getRoles(req, res) {
    try {
        const roles = await Role.find()
            .populate('permissions.permission')
            .populate('permissions.privileges');

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
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL
    const body = req.body; // Datos a actualizar

    try {
        const updatedRole = await Role.findByIdAndUpdate(id, body, { new: true });

        if (!updatedRole) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.status(200).json({ message: 'Rol actualizado exitosamente', updatedRole });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol', error });
    }
}


export async function deleteRole(req, res) {
    const { id } = req.params;

    try {
        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol', error });
    }
}


export async function assignPermissionToRole(req, res) {
    const { roleId, permissionId } = req.params;
    const { privileges } = req.body;
    
    try {
        // Verificar que el rol y el permiso existen
        const role = await Role.findById(roleId);
        const permission = await Permission.findById(permissionId);
        
        if (!role || !permission) {
            return res.status(404).json({ message: 'Rol o permiso no encontrado' });
        }
        
        // Verificar que los privilegios existen
        const privilegesExist = await Privilege.find({ _id: { $in: privileges } });
        if (privilegesExist.length !== privileges.length) {
            return res.status(404).json({ message: 'Uno o más privilegios no existen' });
        }
        
        // Verificar si el permiso ya está asignado al rol
        const permissionIndex = role.permissions.findIndex(p => p.permission.toString() === permissionId);
        
        if (permissionIndex >= 0) {
            // Actualizar privilegios existentes
            role.permissions[permissionIndex].privileges = privileges;
        } else {
            // Agregar nuevo permiso con privilegios
            role.permissions.push({
                permission: permissionId,
                privileges
            });
        }
        
        await role.save();
        res.status(200).json({ messaje: 'Permiso asignado al rol correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar permiso al rol', error });
    }
}

export async function removePermissionFromRole(req, res) {
    const { roleId, permissionId } = req.params;
    
    try {
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        
        role.permissions = role.permissions.filter(p => p.permission.toString() !== permissionId);
        await role.save();
        
        res.status(200).json({ message: 'Permiso eliminado del rol correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el permiso del rol', error });
    }
}