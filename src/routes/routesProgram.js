import { Router } from "express";
import { getProgram } from "../controllers/programController.js";

const routesProgram = Router();

routesProgram.get('/', getProgram)


export default routesProgram