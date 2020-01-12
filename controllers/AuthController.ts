import { NextFunction, Request, Response } from "express";
import { Controller, Get, Put, Post, Delete } from "@overnightjs/core";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import { config } from "../config/app";
import { AbstractController } from "./AbstractController";
import { IUser as Repository } from "../Abstract/UserInterface";
import { IUserM } from "../models/User";

@Controller("api/auth")
export class AuthController extends AbstractController {

    constructor(repository: Repository) {
        super(repository);
    }

    @Post("/register")
    public async registerUser(req: Request, res: Response): Promise<void> {

        const userPayload: IUserM = req.body;
        const user = await this.repository.createNew(userPayload);

        const token = jwt.sign({ username: user.username, userId: user.id }, config.app.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ user, token });
    }

    @Post("/login")
    public authenticateUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local",  (err, user, info) => {
            // no async/await because passport works only with callback ..
            if (err) { return next({err}); }

            if (!user) {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            } else {
                const token = jwt.sign({ username: user.username, userId: user.id }, config.app.JWT_SECRET, { expiresIn: "1h" });
                res.status(200).json({ user, token });
            }
        });
    }
}
