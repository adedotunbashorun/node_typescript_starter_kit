import { NextFunction, Request, Response } from "express";
import { Controller, Get, Put, Post, Delete } from "@overnightjs/core";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import { config } from "../config/app";
import { UserRepository as Repository } from "../abstract/UserRepository";
import { IUserM } from "../models/User";
import * as bcrypt from "bcrypt-nodejs";

@Controller("api/auth")
export class AuthController {
    protected repository: any;
    constructor() {
        this.repository = new Repository();
    }

    @Post("register")
    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const userPayload: IUserM = req.body;
            userPayload.password = bcrypt.hashSync(req.body.password);
            const user = await this.repository.createNew(userPayload);
            const token = jwt.sign({ username: user.username, email: user.email, userId: user.id }, config.app.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ success: true, user, token });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }

    @Put("activate/:id")
    public async activateUser(req: Request, res: Response): Promise<void> {
        try {
            const user: IUserM = await this.repository.findById(req.params.id);
            user.is_active = true;
            user.save();

            res.status(200).json({ success: true, user, msg: "user activated successfully" });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }

    @Post("login")
    public authenticateUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local", { session: false },  (err, user, info) => {
            // no async/await because passport works only with callback ..
            if (err) { return next({err}); }
            if (!user) {
                return res.status(401).json({ success: false, info, msg: "unauthorized" });
            } else {
                req.logIn(user, { session: false }, (err) => {
                    if (err) { return res.json(err.message); }
                    const token = jwt.sign({ username: user.username, email: user.email, userId: user.id }, config.app.JWT_SECRET, { expiresIn: "1h" });
                    res.status(200).json({ user, token });
                });
            }
        })(req, res, next);
    }
}
