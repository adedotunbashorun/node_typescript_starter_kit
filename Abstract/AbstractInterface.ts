export interface IAbstract {

    createNew(data: any): any;

    updateData(id: any, data: any): any;

    findAll(): any;

    findAllDeleted(): any;

    findAllWithDeleted(): any;

    findLimit(limit: number , orderColumn: string, orderDir: string): any;

    findById(id: any): any;

    findBy(where: any, value: any): any;

    findByFirst(where: any, value: any): any;

    softDelete(id: any): any;

    forceDelete(id: any): any;

    countAllDocuments(): any;

    countDocumentsWhere(where: any, value: any): any;
}