
export function isNumeric(s: string): boolean {
    return !isNaN(Number(s));
}

export function isHexCodes(s: string): boolean {
    for (let i = 0; i < s.length; ++i) {
        let c = s.charCodeAt(i);
        if (
            !(48 <= c && c <= 57) &&
            !(65 <= c && c <= 70) &&
            !(97 <= c && c <= 102) &&
            c !== 32
        ) return false;
    }

    return true;
}