"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGODB_URI = "";
if (!exports.MONGODB_URI) {
    console.log("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
