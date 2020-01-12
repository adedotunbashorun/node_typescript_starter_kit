import { IObserver } from ".";
import { Logger } from "@overnightjs/logger";

export class Reminder {
    private observers: IObserver[];

    constructor() {
        this.observers = [];
    }

    public addObserver(ob: IObserver) {
        this.observers.push(ob);
    }

    public removeObserver(observer: IObserver) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    public sendSmsReminder() {
        Logger.Info("sending test reminder:");
        this.observers.map((observer) => observer.sendSms());
    }

    public sendEmailReminder() {
        Logger.Info("sending test reminder:");
        this.observers.map((observer) => observer.sendEmail());
    }

    public sendReminder() {
        Logger.Info("sending test reminder:");
        this.observers.map((observer) => observer.sendEmail());
        this.observers.map((observer) => observer.sendSms());
    }

    public emptyObserver() {
        this.observers = [];
    }

}
