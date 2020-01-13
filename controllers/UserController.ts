import { NextFunction, Request, Response } from "express";
import { Controller, ClassMiddleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { AbstractController } from "./AbstractController";
import { UserRepository as Repository } from "../abstract/UserRepository";
import { checkJwt } from "../middleware/auth";
import { IUserM } from "../models/User";
import { UserService } from "../service/UserService";

@Controller("api/users")
@ClassMiddleware([checkJwt])
export class UserController extends AbstractController {
    private user: any = new UserService();
    constructor() {
        super(new Repository());
    }

    @Get("")
    public async index(req: Request, res: Response): Promise<void> {
        try {
            const user: IUserM = await this.repository.findAll();
            res.status(200).send({ success: true, user });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }
    }

    @Post("register")
    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const user: IUserM = await this.user.create(req);

            res.status(200).json({ success: true, user, msg: "user created successfully!" });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }

    @Put("update/:userId")
    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user: IUserM = await this.user.update(req);

            res.status(200).json({ success: true, user, msg: "user updated successfully" });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }
    }

    @Get(":userId")
    public async findUser(req: Request, res: Response): Promise<void> {
        try {
            const user: IUserM = await this.repository.findById(req.params.userId);

            res.status(200).json({ success: true, user });

        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }
    }

    @Delete("destroy/:id")
    public async destroy(req: Request, res: Response): Promise<void> {
        try {
            await this.repository.forceDelete(req.params.id);
            res.status(200).send({ success: true, msg: "user deleted successfull"});
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }
}
