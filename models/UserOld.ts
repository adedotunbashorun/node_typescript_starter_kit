import { Document, Schema, Model, model, Error } from "mongoose";
import * as bcrypt from "bcrypt-nodejs";

export interface IUserM extends Document {
    first_name?: string;
    last_name?: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    profile_image?: string;
    cloud_image?: string;
    is_active: boolean;
    fullName(): string;
    hashPassword(candidatePassword: any): any;
    comparePassword(candidatePassword: any): boolean;
}

export const userSchema: Schema = new Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    username: { type: String, required: true, index: { unique: true } },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        index: { unique: true },
    },
    phone: { type: String},
    password: { type: String},
    profile_image: { type: String, default: null },
    cloud_image: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: false },
    deleted_at: {type: String, default: null },
}, { timestamps: true });

userSchema.methods.hashPassword = (candidatePassword: string) => {
    // const salt: any = 10;
    return bcrypt.hashSync(candidatePassword, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function(candidatePassword: string) {
    bcrypt.compareSync(candidatePassword, this.password);
};

userSchema.methods.fullName = function(): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
};

export const User: Model<IUserM> = model<IUserM>("User", userSchema);
