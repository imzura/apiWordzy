import { Router } from "express";
import { checkTopicUsage, deleteTopic, getTopic, postTopic, putTopic } from "../controllers/topicController.js";

const routesTopic = Router();

routesTopic.post('/', postTopic)
routesTopic.get('/', getTopic)
routesTopic.put('/:id', putTopic)
routesTopic.delete('/:id', deleteTopic)
routesTopic.get("/:id/usage", checkTopicUsage)

export default routesTopic