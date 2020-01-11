export const toCapital = (str: string): string => {
    return str.toUpperCase();
}

export const toLower = (str: string): string => {
    return str.toLowerCase();
}

export const subString = (str: string, from: number, length: number = 0): string => {
    return str.substr(from, length);
}

export const capitalize = (str: string) => {
    if (typeof str !== "string") { return; }
    return str.charAt(0).toUpperCase() + str.slice(1);
}