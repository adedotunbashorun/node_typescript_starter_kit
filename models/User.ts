import { Document, Schema, Model, model, Error } from "mongoose";
import * as bcrypt from "bcrypt-nodejs";

export interface IUser extends Document {
    first_name?: string;
    last_name?: string;
    username: string;
    password: string;
    profile_image?: string;
    cloud_image?: string;
}

export const userSchema: Schema = new Schema({
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    username: { type: String},
    password: { type: String},
    profile_image: { type: String, default: null },
    cloud_image: { type: String, default: null },
});


userSchema.pre<IUser>("save", function save(next) {
    const user = this;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(this.password, salt, (err: Error, hash: any) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword: string, callback: any) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        callback(err, isMatch);
    });
};

export const User: Model<IUser> = model<IUser>("User", userSchema);
