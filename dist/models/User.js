"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
exports.userSchema = new mongoose_1.Schema({
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    username: { type: String },
    password: { type: String },
    profile_image: { type: String, default: null },
    cloud_image: { type: String, default: null },
});
exports.userSchema.pre("save", function save(next) {
    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
exports.userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        callback(err, isMatch);
    });
};
exports.User = mongoose_1.model("User", exports.userSchema);
