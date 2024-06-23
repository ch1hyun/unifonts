import { ConvertInfo, FontData, InitialInfo, SelectionData } from "../shared/dto"
import { ExceptionTypes, MessagePayload, RequestTypes } from "../shared/network-type";
import { DefaultSelectionNode, NodeType, ParentNode, SelectionNode } from "./lib/dto";
import { constructFontData, getMostUsageFontData } from "./lib/font-parse";
import { requestToUI } from "./lib/network/request";
import { isProcessing, process } from "./lib/process";

figma.showUI(__html__);

figma.ui.resize(600, 461);

async function loadFonts() {
    try {
        const availableFonts = (await figma.listAvailableFontsAsync()).filter(font => !font.fontName.family.startsWith(".") && !font.fontName.family.startsWith("?"));
        const localStyles = figma.getLocalTextStyles();

        const fonts: FontData[] = constructFontData(availableFonts, localStyles);
        return fonts;
    } catch (error) {
        console.log("Error Loading Fonts: ", error);
    }
}

export async function getSelectionTexts(sceneNodes: readonly SceneNode[], parentType: NodeType, parentNode: ParentNode = null): Promise<SelectionNode[]> {
    let res: SelectionNode[] = [];

    for (let i = 0; i < sceneNodes.length; ++i) {
        const sceneNode = sceneNodes[i];

        if (sceneNode.type === "TEXT") {
            res.push({
                parentType: parentType,
                parentNode: parentNode,
                node: (sceneNode as TextNode)
            });
            continue;
        }

        let currentParentNode = null;
        let currentParentType = null;

        if (sceneNode.type === "FRAME") {
            currentParentNode = sceneNode as FrameNode;
            currentParentType = NodeType.Frame;
        }
        else if (sceneNode.type === "COMPONENT") {
            currentParentNode = sceneNode as ComponentNode;
            currentParentType = NodeType.Component;
        }
        else if (sceneNode.type === "GROUP") {
            currentParentNode = sceneNode as GroupNode;
            currentParentType = NodeType.Group;
        }
        else if (sceneNode.type === "INSTANCE") {
            currentParentNode = sceneNode as InstanceNode;
            currentParentType = NodeType.Instance;
        }
        else if (currentParentNode !== null && currentParentNode.children.length) {
            const childSelectionTexts = await getSelectionTexts(currentParentNode.children, currentParentType, currentParentNode);
            res.push(...childSelectionTexts);
        }
    }

    return res;
}

async function getSelectionData(fonts: FontData[]) {
    try {
        const currentSelectionNodes: SelectionNode[] = await getSelectionTexts(figma.currentPage.selection, NodeType.Root);
        if (currentSelectionNodes.length === 0) {
            requestToUI({
                type: ExceptionTypes.NO_SELECTION,
                data: null
            });
            return;
        }

        return <SelectionData> {
            defaultFont: getMostUsageFontData(currentSelectionNodes, fonts)
        };
    } catch (error) {
        console.log("ERROR: while loading selection info - ", error);
    }
}

async function requestInitialInfo(selectionData: SelectionData, fonts: FontData[]) {
    requestToUI({
        type: RequestTypes.INIT,
        data: <InitialInfo> {
            selection: selectionData,
            fonts: fonts
        }
    });
}

async function main() {
    const fonts = await loadFonts();
    const selectionData = await getSelectionData(fonts);
    await requestInitialInfo(selectionData, fonts);
}

main();

figma.ui.onmessage = async function ({ type, data } : MessagePayload) {
    switch(type) {
        case RequestTypes.CLOSE:
            figma.closePlugin();
            break;
        case RequestTypes.PROCESS:
            if (!isProcessing) {
                await process(data as ConvertInfo);
            }
            break;
    }
};