import express from 'express';
import 'dotenv/config'
import dbConnection from '../api wordzy/src/config/database.js'
import routesTopic from './src/routes/routesTopic.js';
import routesRole from './src/routes/routesRole.js';
import routesPermission from './src/routes/routesPermission.js';
import routesPrivilege from './src/routes/routesPrivilege.js';

export default class Server {
    constructor() {
        this.app = express()
        this.listen()
        this.dbConnection()
        this.pathTopic = '/api/topic'
        this.pathRole = '/api/role'
        this.pathPermission = '/api/permission'
        this.pathPrivilege = '/api/privilege'
        this.route()
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running in PORT ${process.env.PORT}`)
        })
    }

    async dbConnection() { //call method dbConnection to conect to mongo
        await dbConnection()
    }

    route() {
        this.app.use(express.json())

        // Routes
        this.app.use(this.pathTopic, routesTopic)
        this.app.use(this.pathRole, routesRole)
        this.app.use(this.pathPermission, routesPermission)
        this.app.use(this.pathPrivilege, routesPrivilege)

    }
}