"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bodyParser = require("body-parser");
const controllers = require("./controllers");
const cors = require("cors");
const core_1 = require("@overnightjs/core");
const logger_1 = require("@overnightjs/logger");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: `${__dirname}/.env` });
const app_1 = require("./config/app");
class AppServer extends core_1.Server {
    constructor() {
        super(true);
        this.SERVER_STARTED = "Example server started on port: ";
        this.config();
        this.mongo();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
        this.setupControllers();
    }
    mongo() {
        const connection = mongoose.connection;
        connection.on("connected", () => {
            logger_1.Logger.Imp("Mongo Connection Established");
        });
        connection.on("reconnected", () => {
            logger_1.Logger.Imp("Mongo Connection Reestablished");
        });
        connection.on("disconnected", () => {
            logger_1.Logger.Imp("Mongo Connection Disconnected");
            logger_1.Logger.Imp("Trying to reconnect to Mongo ...");
            setTimeout(() => {
                mongoose.connect(app_1.config.db.url, {
                    useNewUrlParser: true,
                    autoReconnect: true, keepAlive: true,
                    socketTimeoutMS: 3000, connectTimeoutMS: 3000,
                });
            }, 3000);
        });
        connection.on("close", () => {
            logger_1.Logger.Imp("Mongo Connection Closed");
        });
        connection.on("error", (error) => {
            logger_1.Logger.Imp("Mongo Connection ERROR: " + error);
        });
        const run = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield mongoose.connect(app_1.config.db.url, {
                useNewUrlParser: true,
                autoReconnect: true, keepAlive: true,
            });
        });
        run().catch((error) => logger_1.Logger.Imp(error));
    }
    setupControllers() {
        const ctlrInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = controllers[name];
                ctlrInstances.push(new controller());
            }
        }
        super.addControllers(ctlrInstances);
    }
    start(port) {
        this.app.get("*", (req, res) => {
            res.send(this.SERVER_STARTED + port);
        });
        this.app.listen(port, () => {
            logger_1.Logger.Imp(this.SERVER_STARTED + port);
        });
    }
}
exports.default = AppServer;
