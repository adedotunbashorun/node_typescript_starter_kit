import * as fs from "fs";
import * as cloudinary from "cloudinary";
import { Logger } from "@overnightjs/logger";

export default class File {
    private cloudinaryEnv: any;
    protected readonly dir = "uploads";

    constructor() {
        this.cloudinaryEnv = cloudinary.v2.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_APP_KEY,
            api_secret: process.env.CLOUD_APP_SECRET,
        });
    }

    public localUpload(file: any, dest: string, name: string, extension: string): string {
        if (typeof file !== "undefined" || file !==  "" || file !== null) {
            return this.uploadFile(file, dest, name, extension);
        }
        return "";
    }

    public cloudUpload(file: any) {
        if (typeof file !== "undefined" || file !== "" || file !== null) {
            this.cloudinaryEnv.uploader.upload(file, (error: Error, result: any) => {
                if (error) {
                    Logger.Imp(error);
                }
                if (result) {
                    return result.url;
                }
            });
        }
        return;
    }

    private uploadFile(file: any, dest: any, name: string, extension: string): string {
        let image = file.replace(/^data:.*,/, "");
        image = image.replace(/ /g, "+");
        const bitmap = new Buffer(image, "base64");
        const url = this.dir + dest + name + "-" + Date.now() + extension;
        fs.writeFileSync(url, bitmap);
        return url;
    }
}


