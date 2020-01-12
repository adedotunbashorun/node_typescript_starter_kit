import { NextFunction, Request, Response } from "express";
import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import File from "../utilities/file";
import { AbstractController } from "./AbstractController";
import { IUser as Repository } from "../Abstract/UserInterface";
import { checkJwt } from "../middleware/auth";
import { IUserM } from "../models/User";

@Controller("api/user")
export class UserController extends AbstractController {
    protected file: any;

    constructor(repository: Repository) {
        super(repository);
        this.file = new File();
    }

    @Post("register")
    @Middleware([checkJwt])
    public async registerUser(req: Request, res: Response): Promise<void> {

        const userPayload: IUserM = req.body;
        const user = await this.repository.createNew(userPayload);

        user.profile_image = this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png");
        user.cloud_image = this.file.cloudUpload(req.body.profile_image);
        user.save();

        res.status(200).json({ user });
    }

    @Put("update/:userId")
    @Middleware([checkJwt])
    public async updateUser(req: Request, res: Response): Promise<void> {

        const userPayload: IUserM = req.body;

        const user = await this.repository.updateData(req.params.userId, userPayload);
        user.profile_image = this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png");
        user.cloud_image = this.file.cloudUpload(req.body.profile_image);
        user.save();

        res.status(200).json({ user });
    }

    @Get(":userId")
    @Middleware([checkJwt])
    public async findUser(req: Request, res: Response): Promise<void> {

        const user = await this.repository.findById(req.params.userId);

        res.status(200).json({ user });
    }

    @Delete(":userId")
    @Middleware([checkJwt])
    public async softDeleteUser(req: Request, res: Response): Promise<void> {

        const user = await this.repository.softDelete(req.params.userId);

        res.status(200).json({ user });
    }

    @Delete("destroy/:userId")
    @Middleware([checkJwt])
    public async hardDeleteUser(req: Request, res: Response): Promise<void> {

        const user = await this.repository.forceDelete(req.params.userId);

        res.status(200).json({ user });
    }
}
