import { FontData, LocalStyle } from "../../shared/dto";
import { formatFontName, getMatchedLocalStyleIndex, isSameFontName, undoFormatFontName } from "../../shared/font";
import { SelectionNode } from "./dto";

export function getMostUsageFontData(selections: SelectionNode[], fonts: FontData[]) : FontData {
    let res: FontData = null;
    let fontCheckDict: {[key: string]: number} = {};

    selections.forEach(s => {
        if (s?.node.type === "TEXT") {
            let length = s.node.characters.length;
            for (let i = 0; i < length; ++i) {
                let formattedFont: string = formatFontName(s.node.getRangeFontName(i, i + 1) as FontName);

                if (fontCheckDict[formattedFont] === undefined) {
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
    res = fonts.filter(font => isSameFontName(font.fontName, fontName))[0];

    return res;
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