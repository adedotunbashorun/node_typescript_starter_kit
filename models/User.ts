import { Document, Schema, Model, model, Error } from "mongoose";
import * as bcrypt from "bcrypt-nodejs";

export interface IUserM extends Document {
    first_name?: string;
    last_name?: string;
    username: string;
    email: string;
    password: string;
    profile_image?: string;
    cloud_image?: string;
    fullName(): string;
}

export const userSchema: Schema = new Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    username: { type: String},
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        index: { unique: true },
    },
    password: { type: String},
    profile_image: { type: String, default: null },
    cloud_image: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: false },
    deleted_at: {type: String, default: null },
}, { timestamps: true });


userSchema.pre<IUserM>("save", function save(next) {
    const user = this;
    const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    user.password = hash;
    next();
});

userSchema.methods.comparePassword = function(candidatePassword: string, callback: any) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        callback(err, isMatch);
    });
};

userSchema.methods.fullName = function(): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
};

export const User: Model<IUserM> = model<IUserM>("User", userSchema);
