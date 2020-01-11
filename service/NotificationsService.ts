import * as pusher from "pusher";
import { Notification } from "../models/Notification";

export default class NotificationsService {
    protected pushers: any;

    constructor() {
        this.pushers = new pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: process.env.PUSHER_APP_CLUSTER,
        });
    }

    public async triggerNotification(notifications: string = "notifications", type: string, data: any, req: any, userId: any) {
        await this.pushers.trigger(notifications, type, data, req.headers["x-socket-id"]);
        return await this.saveNotification(notifications = "notifications", type, data, userId);
    }

    private async saveNotification(notifications: string = "notifications", type: any, data: any, userId: any) {

        const notify = await Notification.create({
            userId,
            name: notifications,
            type,
            data: JSON.stringify(data),
        });

        return notify;
    }

}