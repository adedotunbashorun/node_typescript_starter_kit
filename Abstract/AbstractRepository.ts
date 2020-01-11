import * as mongoose from "mongoose";
import { IAbstract } from "./AbstractInterface";

export class AbstractRepository implements IAbstract {
    protected _model: any;

    constructor(model: any) {
        this._model = mongoose.model(model);
    }

    public createNew(data: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.create(data).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public updateData(id: any, data: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.findByIdAndUpdate(id, { $set: data }, { upsert: true, returnNewDocument: true })
            .then( (res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public findAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.find({ deleted_at: null }).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public findAllDeleted(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.find({ deleted_at: { $ne: null }}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public findAllWithDeleted(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.find().then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public findLimit(limit: number = 5, orderColumn: string = "_id", orderDir: string = "1"): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.find({ deleted_at: null}).sort({[orderColumn]: orderDir}).limit(limit).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public findById(id: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.findById(id).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public findBy(where: any, value: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.find({ [where] : value}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public findByFirst(where: any, value: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.findOne({ [where] : value}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public softDelete(id: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.findById(id).then((res: any) => {
                res.deleted_at = new Date();
                res.save();
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public forceDelete(id: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.findOneAndRemove({_id: id }).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public countAllDocuments(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.countDocuments().then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    public countDocumentsWhere(where: any, value: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._model.countDocuments({ [where] : value}).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}