import { FontData, isSameLocalStyle } from "./dto";

export function formatFontName(font: FontName) : string {
    return `${font.family} - ${font.style}`;
}

export function undoFormatFontName(font: string) : FontName{
    return {
        family: font.split("-")[0].trim(),
        style: font.split("-")[1].trim()
    } as FontName;
}

export function formatFontData(font: FontData) : string {
    return font.isLocalStyle ? 
            `${font.localStyle?.name}` :
            `${font.fontName.family} - ${font.fontName.style}`;
}

export function isSameFontName(o: FontName, t: FontName) : boolean{
    return (
        o.family === t.family &&
        o.style === t.style
    );
}

export function isSameFontData(o: FontData, t: FontData) {
    if (o.isLocalStyle !== t.isLocalStyle) return false;
    if (o.isLocalStyle && !isSameLocalStyle(o.localStyle, t.localStyle)) return false;
    if (!o.isLocalStyle && !isSameFontName(o.fontName, t.fontName)) return false;

    return true;
}

export function getMatchedLocalStyleIndex(fontName: FontName, localStyles: TextStyle[]) : number {
    for (let i = 0; i < localStyles.length; ++i) {
        if (isSameFontName(fontName, localStyles[i].fontName)) return i;
    }

    return -1;
}