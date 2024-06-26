import { getSelectionTexts } from "..";
import { ConvertData, ConvertInfo, FontData, UnicodeType } from "../../shared/dto";
import { isSameFontName } from "../../shared/font";
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
    const characters: string = selection.node.characters.trim();
    const maxWidth: number = selection.node.width;
    const initX: number = selection.node.x;
    const initY: number = selection.node.y;

    /* initial values */
    let currentNode: TextNode = selectedNode;
    let prevFontData: FontData = null;
    let nextX: number = initX;
    let nextY: number = initY;

    /* initial setting */
    currentNode.textAutoResize = "WIDTH_AND_HEIGHT";
    currentNode.characters = "";

    // main stream
    for (let i = 0; i <= characters.length; ++i) {
        let isLastCharacter: boolean = false;
        if (i === characters.length) isLastCharacter = true;

        let character: string = null;
        if (!isLastCharacter) {
            character = characters[i];
        }

        // space and basic symbols are inherit previous sentence font.
        let charUnicode = character.charCodeAt(0);
        if (
            (0x20 <= charUnicode && charUnicode <= 0x2F) ||
            (0x3A <= charUnicode && charUnicode <= 0x40) ||
            (0x5B <= charUnicode && charUnicode <= 0x60) ||
            (0x7B <= charUnicode && charUnicode <= 0x7E)
        ) {
            currentNode.characters += character;
            continue;
        }

        // get font name
        let currentFontData: FontData = null;
        if (!isLastCharacter) {
            currentFontData = getFontData(character.charCodeAt(0), converts);
        }

        if (!isLastCharacter && (prevFontData === null || isSameFontName(prevFontData.fontName, currentFontData.fontName))) {
            currentNode.characters += character;
            prevFontData = currentFontData;
        }
        else if (isLastCharacter || !isSameFontName(prevFontData.fontName, currentFontData.fontName)) {
            // ignore side spaces
            currentNode.characters = currentNode.characters.trim();

            // set font name to node
            currentNode.fontName = prevFontData.fontName;
            if (prevFontData.isLocalStyle) {
                currentNode.textStyleId = prevFontData.localStyle.id;
            }

            // if need, split node
            let currentCharacters = currentNode.characters;
            currentNode.characters = "";
            for (let j = 0; j < currentCharacters.length; ++j) {
                let prevCharacters = currentNode.characters;
                currentNode.characters += currentCharacters[j];

                // split
                if (nextX - initX + currentNode.width > maxWidth) {
                    currentNode.characters = prevCharacters;

                    nextX = initX;
                    nextY += currentNode.height;

                    // This case is that latest sentence was end with max width.
                    if (currentNode.characters === "") {
                        currentNode.x = nextX;
                        currentNode.y = nextY;
                        currentNode.characters = currentCharacters[j];
                        continue;
                    }

                    selection.parentNode.appendChild(currentNode);

                    const newNode = currentNode.clone();
                    newNode.characters = currentCharacters[j];
                    newNode.x = nextX;
                    newNode.y = nextY;
                    currentNode = newNode;
                }
            }

            // add to parent
            if (currentNode !== selectedNode) {
                selection.parentNode.appendChild(currentNode);
            }

            // generate new node
            if (!isLastCharacter) {
                // set next x
                nextX += currentNode.width;

                // create new node and insert
                const newNode = currentNode.clone();

                // initial setting new node
                newNode.characters = character;
                newNode.x = nextX;
                newNode.y = nextY;
                prevFontData = currentFontData;
                currentNode = newNode;
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