import { Router } from "express";
import { getPermissions, postPermission, putPermission, deletePermission } from '../controllers/permissionController.js';

const routesPermission = Router();

routesPermission.get('/', getPermissions);
routesPermission.post('/', postPermission);
routesPermission.put('/:id', putPermission);
routesPermission.delete('/:id', deletePermission);

export default routesPermission;