import { NextFunction, Request, Response } from "express";
import { Controller, ClassMiddleware, Get, Put, Post, Delete } from "@overnightjs/core";
import File from "../utilities/file";
import { AbstractController } from "./AbstractController";
import { UserRepository as Repository } from "../abstract/UserRepository";
import { checkJwt } from "../middleware/auth";
import { IUserM } from "../models/User";

@Controller("api/users")
// @ClassMiddleware([checkJwt])
export class UserController extends AbstractController {
    protected file: any;

    constructor() {
        super(new Repository());
        this.file = new File();
    }

    @Get("")
    public async index(req: Request, res: Response): Promise<void> {
        try {
            const data: IUserM = this.repository.findAll();
            res.status(200).send({ success: true, data });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }
    }

    @Post("register")
    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const userPayload: IUserM = req.body;
            const user = await this.repository.createNew(userPayload);

            user.profile_image = this.file.localUpload(req.body.profile_image, "/images/profile/", req.body.last_name, ".png");
            user.cloud_image = this.file.cloudUpload(req.body.profile_image);
            user.save();
            console.log(process.env.user);
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

    @Delete("destroy/:id")
    public async destroy(req: Request, res: Response): Promise<void> {
        try {
            this.repository.forceDelete(req.params.id);
            res.status(200).send({ success: true, msg: "user deleted successfull"});
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }
}
