import { Router } from "express";
import { getPrivileges, postPrivilege, putPrivilege, deletePrivilege } from '../controllers/privilegeController.js';

const routesPrivilege = Router();

routesPrivilege.get('/', getPrivileges);
routesPrivilege.post('/', postPrivilege);
routesPrivilege.put('/:id', putPrivilege);
routesPrivilege.delete('/:id', deletePrivilege);

export default routesPrivilege;