"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCapital = (str) => {
    return str.toUpperCase();
};
exports.toLower = (str) => {
    return str.toLowerCase();
};
exports.subString = (str, from, length = 0) => {
    return str.substr(from, length);
};
exports.capitalize = (str) => {
    if (typeof str !== "string") {
        return;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};
