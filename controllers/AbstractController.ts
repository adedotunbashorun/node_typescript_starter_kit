import { NextFunction, Request, Response } from "express";
import { Controller, Get, Delete } from "@overnightjs/core";

@Controller("")
export class AbstractController {
    protected repository: any;

    constructor(repository: any) {
        this.repository = repository;
    }

    @Get("")
    public async index(req: Request, res: Response): Promise<void> {
        try {
            const data: any = this.repository.findAll();
            res.status(200).send({ success: true, data });
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }
    }

    @Delete("destroy/:id")
    public async destroy(req: Request, res: Response): Promise<void> {
        try {
            this.repository.forceDelete(req.params.id);
            res.status(200).send({ success: true, msg: "record deleted successfull"});
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }

    @Delete("delete/:id")
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            this.repository.softDelete(req.params.id);
            res.status(200).send({ success: true, msg: "record deleted successfull"});
        } catch (error) {
            res.status(401).json({ success: false, error, msg: error.message });
        }

    }
}
