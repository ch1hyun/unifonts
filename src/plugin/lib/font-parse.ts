import { FontData, LocalStyle } from "../../shared/dto";
import { formatFontName, getMatchedLocalStyleIndex, isSame, undoFormatFontName } from "../../shared/font";

export function getMostUsageFontData(selections:readonly SceneNode[], fonts: FontData[]) : FontData {
    let res: FontData = null;
    let fontCheckDict: {[key: string]: number} = {};

    selections.forEach(s => {
        if (s?.type === "TEXT") {
            let length = s.characters.length;
            for (let i = 0; i < length; ++i) {
                let formattedFont: string = formatFontName(s.getRangeFontName(i, i + 1) as FontName);

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
    res = fonts.filter(font => isSame(font.fontName, fontName))[0];

    return res;
}

export function fontToFontData(fonts: Font[], localStyles: TextStyle[]) : FontData[] {
    const res: FontData[] = [];

    fonts.forEach(font => {
        let fontName: FontName = font.fontName;
        let lsi = getMatchedLocalStyleIndex(fontName, localStyles);
        if (lsi === -1) {
            res.push(<FontData>{
                fontName: fontName,
                isLocalStyle: false,
                localStyle: null
            });
        } else {
            res.push(<FontData>{
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