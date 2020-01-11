import * as EventEmitter from "events";
import Core from "../service/CoreService";
import Sms from "../service/Sms/AfricasTalking";
import Notification from "../service/NotificationsService";

export class UserEvents extends EventEmitter.EventEmitter {
    protected sms: any; protected user: any; protected core: any; protected req: any; protected notification: any;

    constructor(user: any, req: any) {
        super();
        this.user = user;
        this.req = req;
        this.sms = new Sms();
        this.core = new Core();
        this.notification = new Notification();
        // Become eaten when gator emits 'gatorEat'
        this.on('onRegister', this.onRegister);
    }

    async onRegister() {

        let user = this.user;

        this.core.Email(user, 'New Registration', this.core.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at fashionCast.<br> Please click the link below to complete registration https://fashioncastapi.herokuapp.com/api/activate/' + user.temporarytoken + '</p>'));

        this.sms.sendSms(user.phone, 'Hello '+ user.first_name+' this is your activation code '+user.phone_code);

        this.core.activity_log(this.req, user.id, 'Registered');

        this.notification.triggerNotification('notifications','users',{user, message: {msg: user.last_name + " Just created a new account."}}, this.req);

        
    }

    async onActivate(){

        let user = this.user;

        if (user.is_active == false) {
            this.core.Email(user, 'Account De-activated', this.core.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for using Refill. Your Account has been de-activated please contact support for re-activation @ refill.com.ng \n\r Thank You.'));
        } else {
            this.core.Email(user, 'Account Activated', this.core.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at Refill. Your Account has been activated successfully.'));
        } 
        this.core.activity_log(this.req, user.id, 'Activated Account')
    }

    async onLogin(){

        let user = this.user;
        
        this.core.activity_log(this.req, user.id, 'User logged into account')
    }

    async onLogout(){

        let user = this.user;
        
        this.core.activity_log(this.req, user.id, 'User logged out of account')
    }
}