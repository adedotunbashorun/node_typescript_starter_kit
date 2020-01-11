import * as bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import { Controller, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import "../config/passport";
import { User } from "../models/user";
import { JWT_SECRET } from "../config/jwt";
import File from "../utilities/file";
import { capitalize } from "../utilities/string";

@Controller("api/user")
export class UserController {
    protected file: any;

    constructor() {
        this.file = new File();
    }

    @Post("/register")
    public async registerUser(req: Request, res: Response): Promise<void> {
        const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        const user = await User.create({
            first_name: capitalize(req.body.first_name),
            last_name: capitalize(req.body.last_name),
            username: req.body.username,
            password: hashedPassword,
            profile_image: this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png"),
        });

        this.file.cloudUpload(user, req.body.profile_image);

        const token = jwt.sign({ username: user.username, scope : req.body.scope }, JWT_SECRET);
        res.status(200).send({ user, token });
    }

    @Post("/login")
    public authenticateUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local",  (err, user, info) => {
            // no async/await because passport works only with callback ..
            if (err) { return next({err}); }

            if (!user) {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            } else {
                const token = jwt.sign({ username: user.username }, JWT_SECRET);
                res.status(200).send({ token });
            }
        });
    }
}