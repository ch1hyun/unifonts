import { FontData } from "./dto";

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

export function isSame(origin: FontName, target: FontName) : boolean{
    return (
        origin.family === target.family &&
        origin.style === target.style
    );
}

export function getMatchedLocalStyleIndex(fontName: FontName, localStyles: TextStyle[]) : number {
    for (let i = 0; i < localStyles.length; ++i) {
        if (isSame(fontName, localStyles[i].fontName)) return i;
    }

    return -1;
}