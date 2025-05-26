import { Router } from "express";
import { getRoles, postRole, putRole, deleteRole } from '../controllers/roleController.js';

const routesRole = Router();

routesRole.get('/', getRoles);
routesRole.post('/', postRole);
routesRole.put('/:id', putRole);
routesRole.delete('/:id', deleteRole);

export default routesRole;