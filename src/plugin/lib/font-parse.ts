import { FontData, LocalStyle, SelectionData } from "../../shared/dto";
import { formatFontName, getMatchedLocalStyleIndex, isSameFontName, undoFormatFontName } from "../../shared/font";
import { SelectionNode } from "./dto";

export function generateSelectionData(selections: SelectionNode[], fonts: FontData[]) : SelectionData {
    const selectionData: SelectionData = {
        defaultFont: null,
        usedFonts: []
    };

    let fontCheckDict: {[key: string]: number} = {};

    selections.forEach(s => {
        if (s?.node.type === "TEXT") {
            let length = s.node.characters.length;
            for (let i = 0; i < length; ++i) {
                const fontName: FontName = s.node.getRangeFontName(i, i + 1) as FontName;

                let formattedFont: string = formatFontName(fontName);

                if (fontCheckDict[formattedFont] === undefined) {
                    selectionData.usedFonts.push(fontName);
                    fontCheckDict[formattedFont] = 0;
                }

                ++fontCheckDict[formattedFont];
            }
        }
    })

    let fontName: FontName = null;
    let mx: number = 0;
    Object.keys(fontCheckDict).map(k => {
        if (mx < fontCheckDict[k]) {
            fontName = undoFormatFontName(k);
            mx = fontCheckDict[k];
        }
    })
    selectionData.defaultFont = fonts.filter(font => isSameFontName(font.fontName, fontName))[0];

    return selectionData;
}

export function constructFontData(fonts: Font[], localStyles: TextStyle[]) : FontData[] {
    const res: FontData[] = [];
    let id = 1;

    fonts.forEach(font => {
        let fontName: FontName = font.fontName;
        let lsi = getMatchedLocalStyleIndex(fontName, localStyles);
        if (lsi === -1) {
            res.push(<FontData>{
                id: id++,
                fontName: fontName,
                isLocalStyle: false,
                localStyle: null
            });
        } else {
            res.push(<FontData>{
                id: id++,
                fontName: fontName,
                isLocalStyle: true,
                localStyle: <LocalStyle> {
                    id: localStyles[lsi].id,
                    name: localStyles[lsi].name
                }
            });
        }
    })

    return res;
}