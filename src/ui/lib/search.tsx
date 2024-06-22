import { FontData } from "../../shared/dto";
import { formatFontData, formatFontName } from "../../shared/font";

export function search(availableFonts: FontData[], keyword: string): FontData[] {
    let res: FontData[] = [];

    if (keyword.length === 0) return [...availableFonts];

    keyword = keyword.toLowerCase();
    availableFonts.map(font => {
        let formattedFontData = formatFontData(font).toLowerCase();
        let  formattedFontName = formatFontName(font.fontName).toLowerCase();

        if (
            formattedFontData.includes(keyword) ||
            formattedFontName.includes(keyword)
        ) {
            res.push(font);
        }
    });

    return res;
}