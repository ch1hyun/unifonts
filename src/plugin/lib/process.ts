import { getSelectionTexts } from "..";
import { ConvertInfo } from "../../shared/dto";
import { NodeType, SelectionNode } from "./dto";

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

    const selectionNodes: SelectionNode[] = await getSelectionTexts(figma.currentPage.selection, NodeType.Root);

    // check selection is exist
    if (selectionNodes.length === 0) {
        exit();
    }

    // loading fonts
    await loadFonts(convertInfo.fonts);

    setIsProcessing(false);
}