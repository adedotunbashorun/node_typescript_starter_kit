"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
exports.userSchema = new mongoose_1.Schema({
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    username: { type: String },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: { unique: true },
    },
    password: { type: String },
    profile_image: { type: String, default: null },
    cloud_image: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: false },
});
exports.userSchema.pre("save", function save(next) {
    const user = this;
    const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    user.password = hash;
    next();
});
exports.userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        callback(err, isMatch);
    });
};
exports.User = mongoose_1.model("User", exports.userSchema);
