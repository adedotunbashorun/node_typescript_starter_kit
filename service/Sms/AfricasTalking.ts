// import { config } from "../../config/app";
// import { africastalking } from "africastalking";
// import { Logger } from "@overnightjs/logger";

// export default class AfricasTalking {
//     protected africastalking: any;

//     constructor() {
//         this.africastalking = africastalking(config.sms.africastalking);
//     }

//     public sendSms(to: any, message: string) {
//         const sms = this.africastalking.SMS;

//         // Use the service
//         const options = {
//             to,
//             message,
//             // from: 'ServeMe'
//         };

//         // Send message and capture the response or error
//         sms.send(options).then( (response: any) => {
//             Logger.Imp(response);
//         })
//         .catch( (error: any) => {
//                 Logger.Imp(error);
//         });
//     }
// }

