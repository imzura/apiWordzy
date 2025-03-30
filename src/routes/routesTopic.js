import { Router } from "express";
import { deleteTopic, getTopic, postTopic, putTopic } from "../controllers/topicController.js";

const routesTopic = Router();

routesTopic.post('/', postTopic)
routesTopic.get('/', getTopic)
routesTopic.put('/:id', putTopic)
routesTopic.delete('/:id', deleteTopic)

export default routesTopic