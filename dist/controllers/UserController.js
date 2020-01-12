"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@overnightjs/core");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../config/passport");
const app_1 = require("../config/app");
const file_1 = require("../utilities/file");
const AbstractController_1 = require("./AbstractController");
let UserController = class UserController extends AbstractController_1.AbstractController {
    constructor(repository) {
        super(repository);
        this.file = new file_1.default();
    }
    registerUser(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.createNew(req.body);
            user.profile_image = this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png");
            user.cloud_image = this.file.cloudUpload(req.body.profile_image);
            user.save();
            const token = jwt.sign({ username: user.username, scope: req.body.scope }, app_1.config.app.JWT_SECRET);
            res.status(200).json({ user, token });
        });
    }
    authenticateUser(req, res, next) {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next({ err });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            }
            else {
                const token = jwt.sign({ username: user.username }, app_1.config.app.JWT_SECRET);
                res.status(200).json({ user, token });
            }
        });
    }
};
tslib_1.__decorate([
    core_1.Post("/register"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
tslib_1.__decorate([
    core_1.Post("/login"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Function]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "authenticateUser", null);
UserController = tslib_1.__decorate([
    core_1.Controller("api/user"),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserController);
exports.UserController = UserController;
