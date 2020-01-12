import { NextFunction, Request, Response } from "express";
import { Controller, ClassMiddleware, Get, Put, Post, Delete } from "@overnightjs/core";
import File from "../utilities/file";
import { AbstractController } from "./AbstractController";
import { UserRepository as Repository } from "../abstract/UserRepository";
import { checkJwt } from "../middleware/auth";
import { IUserM } from "../models/User";

@Controller("api/user")
@ClassMiddleware([checkJwt])
export class UserController extends AbstractController {
    protected file: any;

    constructor(repository: Repository) {
        super(new Repository());
        this.file = new File();
    }

    @Post("register")
    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const userPayload: IUserM = req.body;
            const user = await this.repository.createNew(userPayload);

            user.profile_image = this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png");
            user.cloud_image = this.file.cloudUpload(req.body.profile_image);
            user.save();

            res.status(200).json({ success: true, user, msg: "user created successfully!" });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }

    @Put("update/:userId")
    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userPayload: IUserM = req.body;

            const user = await this.repository.updateData(req.params.userId, userPayload);
            user.profile_image = this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png");
            user.cloud_image = this.file.cloudUpload(req.body.profile_image);
            user.save();

            res.status(200).json({ success: true, user, msg: "user updated successfully" });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }
    }

    @Get(":userId")
    public async findUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.repository.findById(req.params.userId);

            res.status(200).json({ success: true, user });

        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }
    }
}
