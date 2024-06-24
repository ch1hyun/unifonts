import { ConvertInfo, FontData, InitialInfo, SelectionData } from "../shared/dto"
import { ExceptionTypes, MessagePayload, RequestTypes } from "../shared/network-type";
import {  ParentNode, SelectionNode } from "./lib/dto";
import { constructFontData, generateSelectionData } from "./lib/font-parse";
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

export async function getSelectionTexts(sceneNodes: readonly SceneNode[], parentNode: ParentNode = null): Promise<SelectionNode[]> {
    let res: SelectionNode[] = [];

    for (let i = 0; i < sceneNodes.length; ++i) {
        const sceneNode = sceneNodes[i];

        if (sceneNode.type === "TEXT") {
            if ((sceneNode as TextNode).characters.trim().length > 0) {
                res.push({
                    parentNode: parentNode,
                    node: (sceneNode as TextNode)
                });
            }
            continue;
        }

        let currentParentNode = null;

        if (sceneNode.type === "FRAME") {
            currentParentNode = sceneNode as FrameNode;
        }
        else if (sceneNode.type === "COMPONENT") {
            currentParentNode = sceneNode as ComponentNode;
        }
        else if (sceneNode.type === "GROUP") {
            currentParentNode = sceneNode as GroupNode;
        }
        else if (sceneNode.type === "INSTANCE") {
            currentParentNode = sceneNode as InstanceNode;
        }

        if (currentParentNode !== null && currentParentNode.children.length) {
            const childSelectionTexts = await getSelectionTexts(currentParentNode.children, currentParentNode);
            res.push(...childSelectionTexts);
        }
    }

    return res;
}

async function getSelectionData(fonts: FontData[]) {
    try {
        const currentSelectionNodes: SelectionNode[] = await getSelectionTexts(figma.currentPage.selection, figma.currentPage);
        if (currentSelectionNodes.length === 0) {
            requestToUI({
                type: ExceptionTypes.NO_SELECTION,
                data: null
            });
            return;
        }

        return generateSelectionData(currentSelectionNodes, fonts);

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