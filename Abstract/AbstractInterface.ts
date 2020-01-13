export interface IAbstract {

    createNew(data: any): void;

    updateData(id: any, data: any): void;

    findAll(): void;

    findAllDeleted(): void;

    findAllWithDeleted(): void;

    findLimit(limit: number , orderColumn: string, orderDir: string): void;

    findById(id: any): void;

    findBy(where: any, value: any): void;

    findByFirst(where: any, value: any): void;

    softDelete(id: any): void;

    forceDelete(id: any): void;

    countAllDocuments(): void;

    countDocumentsWhere(where: any, value: any): void;
}
