import { AbstractRepository } from "./AbstractRepository";
import { IUser } from "./UserInterface";

export class UserRepository extends AbstractRepository implements IUser {

    constructor() {
        super("User");
    }
}