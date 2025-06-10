import { Router } from "express";
import { getCourseProgramming, createCourseProgramming, getById, updateCourseProgramming, deleteCourseProgramming } from "../controllers/courseProgramingController.js";

const routesCoursePrograming = Router();

routesCoursePrograming.post('/', createCourseProgramming)
routesCoursePrograming.get('/', getCourseProgramming)
routesCoursePrograming.get('/:id', getById)
routesCoursePrograming.put('/:id', updateCourseProgramming)
routesCoursePrograming.delete('/:id', deleteCourseProgramming)

export default routesCoursePrograming