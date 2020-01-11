import { NextFunction, Request, Response } from "express";
import { Get, Delete } from "@overnightjs/core";

export class AbstractController {
    protected repository: any;

    constructor(repository: any) {
        this.repository = repository;
    }

    @Get("/")
    public async index(req: Request, res: Response): Promise<void> {
        try {
            const data: any = this.repository.findAll();
            res.status(200).send({ data, success: true });
        } catch (error) {
            res.status(401).json({ success: false, status: "error", error });
        }
    }

    @Delete(":id")
    public async destroy(req: Request, res: Response): Promise<void> {
        try {
            this.repository.forceDelete(req.params.id);
            res.status(200).send({ success: true, message: "record deleted successfull"});
        } catch (error) {
            res.status(401).json({ success: false, status: "error", error });
        }

    }
}