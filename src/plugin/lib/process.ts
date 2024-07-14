import { getSelectionTexts } from "..";
import { ConvertData, ConvertInfo, FontData, UnicodeType } from "../../shared/dto";
import { isSameFontData, isSameFontName } from "../../shared/font";
import { SelectionNode } from "./dto";

export let isProcessing: boolean = false;

function exit() {
    figma.closePlugin();
}

function setIsProcessing(p: boolean) {
    isProcessing = p;
}

async function loadFonts(fonts: FontName[]) {
    for (const font of fonts) {
        await figma.loadFontAsync(font);
    }
}

/* main process entry */
export async function process(convertInfo: ConvertInfo) {
    setIsProcessing(true);

    const selectionNodes: SelectionNode[] = await getSelectionTexts(figma.currentPage.selection, figma.currentPage);

    // check selection is exist
    if (selectionNodes.length === 0) {
        exit();
    }

    // loading fonts
    await loadFonts(convertInfo.fonts);

   admitConvertEntry(selectionNodes, convertInfo.converts);

    setIsProcessing(false);
    exit();
}

function admitConvertEntry(selections: SelectionNode[], converts: ConvertData[]) {
    for (const selection of selections) {
        admitConvert(selection, converts);
    }
}

function admitConvert(selection: SelectionNode, converts: ConvertData[]) {
    /* origin values */
    const selectedNode: TextNode = selection.node;
    const characters: string = selectedNode.characters.trim();
    const maxWidth: number = selectedNode.width;
    const initX: number = selectedNode.x;
    const initY: number = selectedNode.y;

    /* initial values */
    let currentNode: TextNode = selectedNode;
    let prevFontData: FontData = null;
    let nextX: number = initX;
    let nextY: number = initY;

    let isCvtNum: boolean = isConvertNumber(converts);
    let buffer: Array<string> = [];

    /* initial setting */
    const LINE_FEED = 0x0A;
    currentNode.textAutoResize = "WIDTH_AND_HEIGHT";
    currentNode.characters = "";

    // main stream
    for (let i = 0; i <= characters.length; ++i) {
        // is last?
        let isLast: boolean = (i == characters.length);
        let character: string = !isLast ? characters[i] : null;

        // space and basic symbols are inherit previous sentence font.
        if (!isLast && isIgnoreCase(character, !isCvtNum)) {
            buffer.push(character);
            continue;
        }

        let curFontData: FontData = !isLast ? getFontData(character.charCodeAt(0), converts) : null;

        let isSameFD: boolean = (!isLast && character.charCodeAt(0) != LINE_FEED && (prevFontData == null || isSameFontData(prevFontData, curFontData)));
        if (isSameFD) {
            buffer.push(character);
            prevFontData = curFontData;
            continue;
        }
        // if buffer has one line feed, add empty vertical space
        if (!isLast && character.charCodeAt(0) == LINE_FEED && buffer.length == 0) {
            nextY += currentNode.height;
            currentNode.y = nextY;
            prevFontData = null;
            continue;
        }

        // set font name to node
        currentNode.fontName = prevFontData.fontName;
        if (prevFontData.isLocalStyle) {
            currentNode.textStyleId = prevFontData.localStyle.id;
        }

        // if characters overflow width, split node
        let prevCharacters: string;
        for (const b of buffer) {
            prevCharacters = currentNode.characters;
            currentNode.characters += b;

            if (currentNode.x - initX + currentNode.width >= maxWidth) {
                currentNode.characters = prevCharacters;

                nextX = initX;
                nextY += currentNode.height;

                currentNode = currentNode.clone();
                currentNode.x = nextX;
                currentNode.y = nextY;
                currentNode.characters = b;
                selection.parentNode.appendChild(currentNode);
            }
        }

        if (!isLast) {
            nextX += currentNode.width;
            if (character.charCodeAt(0) == LINE_FEED) {
                nextX = initX;
                nextY += currentNode.height;
            }

            currentNode = currentNode.clone();
            currentNode.x = nextX;
            currentNode.y = nextY;
            currentNode.characters = "";
            selection.parentNode.appendChild(currentNode);

            // reset font data
            prevFontData = null;

            // reset buffer
            buffer = [];

            if (character.charCodeAt(0) != LINE_FEED) {
                prevFontData = curFontData;
                buffer.push(character);
            }
        }
    }
}

function getFontData(targetUnicode: number, converts: ConvertData[]): FontData {
    for (const convert of converts) {
        for (const unicode of convert.unicodes) {
            switch (unicode.type) {
                case UnicodeType.Single:
                    if (targetUnicode === unicode.from) {
                        return convert.font;
                    }
                    break;
                case UnicodeType.Range:
                    if (unicode.from <= targetUnicode && targetUnicode <= unicode.to) {
                        return convert.font;
                    }
                    break;
                case UnicodeType.Default:
                    return convert.font;
            }
        }
    }

    return converts[converts.length - 1].font;
}

function isIgnoreCase(character: string, numberIgnore: boolean = false): boolean {
    let charUnicode = character.charCodeAt(0);

    if (
        (0x20 <= charUnicode && charUnicode <= 0x2F) ||
        (0x3A <= charUnicode && charUnicode <= 0x40) ||
        (0x5B <= charUnicode && charUnicode <= 0x60) ||
        (0x7B <= charUnicode && charUnicode <= 0x7E) ||
        (
            numberIgnore &&
            (0x30 <= charUnicode && charUnicode <= 0x39)
        )
    ) {
        return true;
    }

    return false;
}

function isConvertNumber(converts: ConvertData[]): boolean {
    for (const c of converts) {
        for (const u of c.unicodes) {
            if (
                u.type === "Range" &&
                u.from === 48 &&
                u.to === 57
            ) {
                return true;
            }
        }
    }

    return false;
}