import * as EventEmitter from "events";
import Core from "../service/CoreService";
import Sms from "../service/Sms/AfricasTalking";
import Notification from "../service/NotificationsService";
import { Request } from "express";
export class UserEvents extends EventEmitter.EventEmitter {
    protected sms: any; protected user: any; protected core: any; protected notification: any;
    private req!: Request;
    constructor() {
        super();
        this.user = process.env.user;
        this.sms = new Sms();
        this.core = new Core();
        this.notification = new Notification();
        // Become eaten when gator emits 'gatorEat'
        this.on("onRegister", this.onRegister);
    }

    public async onRegister() {
        const user = this.user;

        this.core.Email(user, "New Registration", this.core.html('<p style="color: #000">Hello ' + user.first_name + " " + user.last_name + ", Thank you for registering at fashionCast.<br> Please click the link below to complete registration https://fashioncastapi.herokuapp.com/api/activate/" + user.temporarytoken + "</p>"));

        this.sms.sendSms(user.phone, `Hello ${user.first_name} this is your activation code ${user.phone_code}`);

        this.core.activity_log(this.req, user.id, "Registered");

        this.notification.triggerNotification("notifications", "users", {user, message: {msg: user.last_name + " Just created a new account."}}, this.req);


    }

    public async onActivate() {

        const user = this.user;

        if (user.is_active === false) {
            this.core.Email(user, "Account De-activated", this.core.html(`<p style="color: #000">Hello  ${user.first_name} ${user.last_name}, Thank you for using Refill. Your Account has been de-activated please contact support for re-activation @ refill.com.ng \n\r Thank You.`));
        } else {
            this.core.Email(user, "Account Activated", this.core.html(`<p style="color: #000">Hello ${user.first_name} ${user.last_name}, Thank you for registering at Refill. Your Account has been activated successfully.`));
        }
        this.core.activity_log(this.req, user.id, "Activated Account");
    }

    public async onLogin()  {

        const user = this.user;

        this.core.activity_log(this.req, user.id, "User logged into account");
    }

    public async onLogout() {

        const user = this.user;

        this.core.activity_log(this.req, user.id, "User logged out of account");
    }
}
