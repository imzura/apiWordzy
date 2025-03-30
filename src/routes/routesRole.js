import { Router } from "express";
import { getRoles, postRole, putRole, deleteRole, assignPermissionToRole, removePermissionFromRole } from '../controllers/roleController.js';

const routesRole = Router();

routesRole.get('/', getRoles);
routesRole.post('/', postRole);
routesRole.put('/:id', putRole);
routesRole.delete('/:id', deleteRole);
routesRole.post('/:roleId/permissions/:permissionId', assignPermissionToRole);
routesRole.delete('/:roleId/permissions/:permissionId', removePermissionFromRole);

export default routesRole;