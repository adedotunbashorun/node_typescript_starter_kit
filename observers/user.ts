import { IObserver } from "./contracts";
import { Logger } from "@overnightjs/logger";
import { IUserM } from "../models/User";

export class UserObserver implements IObserver {

    public user: IUserM;

    constructor(user: any) {
        this.user = user;
    }

    public sendEmail(): void {
        Logger.Info(`Sending a mail to ${this.user.fullName}`);
        // Code to send a mail for the client, informing there's a sale going on
    }
    public sendSms(): void {
        Logger.Info(`Sending a sms to ${this.user.phone}`);
    }

}

