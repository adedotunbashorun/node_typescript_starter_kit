import { Document, Schema, Model, model, Error } from "mongoose";

export interface INotification extends Document {
    userId: any;
    name: string;
    type: string;
    data: object;
    status: string;
}

export const notificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true},
    type: {type: String, required: true},
    data: {type: Object, required: true},
    status: {type: String, default: false },
}, { timestamps: true });

export const Notification: Model<INotification> = model<INotification>("Notification", notificationSchema);
