import { Unicode } from "../../shared/dto";

export function padUnicode(n : number) : string {
    return n !== null && n !== undefined ? `${n.toString(16).padStart(5, "0").toUpperCase()}` : "";
}

export function formatUnicode(unicode: Unicode) : string {
    if (unicode.from === null || unicode.from === undefined) return "EMPTY";
    if (unicode.type === "range" && (unicode.to === null || unicode.to === undefined)) return "Invalid";

    if (unicode.type === "default") return "Default";
    if (unicode.type === "single") return `U+${padUnicode(unicode.from)}`;
    if (unicode.type === "range") return `U+${padUnicode(unicode.from)}-${padUnicode(unicode.to)}`;

    return "Error";
}