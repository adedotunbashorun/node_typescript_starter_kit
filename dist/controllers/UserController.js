"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt = require("bcrypt-nodejs");
const core_1 = require("@overnightjs/core");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../config/passport");
const user_1 = require("../models/user");
const jwt_1 = require("../config/jwt");
const file_1 = require("../utilities/file");
const string_1 = require("../utilities/string");
let UserController = class UserController {
    constructor() {
        this.file = new file_1.default();
    }
    registerUser(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            const user = yield user_1.User.create({
                first_name: string_1.capitalize(req.body.first_name),
                last_name: string_1.capitalize(req.body.last_name),
                username: req.body.username,
                password: hashedPassword,
                profile_image: this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png"),
            });
            this.file.cloudUpload(user, req.body.profile_image);
            const token = jwt.sign({ username: user.username, scope: req.body.scope }, jwt_1.JWT_SECRET);
            res.status(200).send({ user, token });
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
                const token = jwt.sign({ username: user.username }, jwt_1.JWT_SECRET);
                res.status(200).send({ token });
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
    tslib_1.__metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
