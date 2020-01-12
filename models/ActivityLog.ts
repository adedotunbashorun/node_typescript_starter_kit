import { Document, Schema, Model, model, Error } from "mongoose";

export interface IActivityLog extends Document {
    userId: any;
    description: string;
    ipAddress: string;
}

export const activitySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    description: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const ActivityLog: Model<IActivityLog> = model<IActivityLog>("ActivityLog", activitySchema);
