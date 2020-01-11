"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const cloudinary = require("cloudinary");
const logger_1 = require("@overnightjs/logger");
class File {
    constructor() {
        this.dir = "uploads";
        this.cloudinaryEnv = cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_APP_KEY,
            api_secret: process.env.CLOUD_APP_SECRET,
        });
    }
    localUpload(file, dest, name, extension) {
        if (typeof file !== "undefined" || file !== "" || file !== null) {
            return this.uploadFile(file, dest, name, extension);
        }
        return "";
    }
    cloudUpload(model, file) {
        if (typeof file !== "undefined" || file !== "" || file !== null) {
            this.cloudinaryEnv.uploader.upload(file, (error, result) => {
                if (error) {
                    logger_1.Logger.Imp(error);
                }
                if (result) {
                    model.cloud_image_url = result.secure_url;
                    model.save();
                    return result.url;
                }
            });
        }
        return;
    }
    uploadFile(file, dest, name, extension) {
        let image = file.replace(/^data:.*,/, "");
        image = image.replace(/ /g, "+");
        const bitmap = new Buffer(image, "base64");
        const url = this.dir + dest + name + "-" + Date.now() + extension;
        fs.writeFileSync(url, bitmap);
        return url;
    }
}
exports.default = File;
