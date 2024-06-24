import { ConvertData, ConvertInfo, Tag, Unicode } from "../../../shared/dto";
import { UIConvertData } from "../../component/dto";

function generateConvertData(convert: UIConvertData, tags: Tag[]): ConvertData {
    const matchedTags: Tag[] = tags.filter(t => convert.tags.indexOf(t.id) !== -1);

    const matchedUnicodes: Unicode[] = [];
    matchedTags.map(mt => matchedUnicodes.push(...mt.unicodes));
    // Maybe it is no need anymore
    // matchedUnicodes.sort((a, b) => {
    //     if (a.type === "single" && b.type === "single") {
    //         if (a.from < b.from) return -1;
    //         else if (a.from > b.from) return 1;
    //     } else if (a.type === "single" && b.type === "range") {
    //         return -1;
    //     } else if (a.type === "range" && b.type === "single") {
    //         return 1;
    //     } else if (a.type === "range" && b.type === "range") {
    //         if (a.from < b.from && a.to > b.to) return 1;
    //         else if (a.from > b.from && a.to < b.to) return -1;
    //         else if (a.from === b.from) {
    //             if (a.to < b.to) return -1;
    //             else if (a.to > b.to) return 1;
    //         }
    //         else if (a.from < b.from) return -1;
    //         else if (a.from > b.from) return 1;
    //     }

    //     return 0;
    // });

    return {
        unicodes: matchedUnicodes,
        font: convert.font
    };
}

function extractFontNamesFromConverts(converts: ConvertData[]): FontName[] {
    const fontNames: FontName[] = [];

    converts.map(c => fontNames.push(c.font.fontName));

    return fontNames;
}

export function generateConvertInfo(defaultConvert: UIConvertData, generalConverts: UIConvertData[], tags: Tag[], usedFonts: FontName[]): ConvertInfo {
    const converts: ConvertData[] = [];

    generalConverts.map(gc => converts.push(generateConvertData(gc, tags)));
    converts.push(generateConvertData(defaultConvert, tags));

    const fontNames: FontName[] = extractFontNamesFromConverts(converts);
    fontNames.push(...usedFonts);

    return {
        converts: converts,
        fonts: fontNames
    };
}