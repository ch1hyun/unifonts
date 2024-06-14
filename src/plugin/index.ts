import { FontData, InitialInfo, SelectionData } from "../shared/dto"
import { fontToFontData, getMostUsageFontData } from "./lib/font-parse";
import { sendInitialInfo } from "./lib/network/request";

figma.showUI(__html__);

figma.ui.resize(760, 631);

async function loadFonts() {
    try {
        const availableFonts = (await figma.listAvailableFontsAsync()).filter(font => !font.fontName.family.startsWith(".") && !font.fontName.family.startsWith("?"));
        const localStyles = figma.getLocalTextStyles();

        const fonts: FontData[] = fontToFontData(availableFonts, localStyles);
        return fonts;
    } catch (error) {
        console.log("Error Loading Fonts: ", error);
    }
}

async function getSelectionTexts(sceneNodes: readonly SceneNode[]) {
    let res: SceneNode[] = [];

    for (let i = 0; i < sceneNodes.length; ++i) {
        const sceneNode = sceneNodes[i];

        if (sceneNode.type === "TEXT") {
            res.push(sceneNode);
        }

        let convertedSceneNode = null;

        if (sceneNode.type === "FRAME") {
            convertedSceneNode = sceneNode as FrameNode;
        }

        if (sceneNode.type === "COMPONENT") {
            convertedSceneNode = sceneNode as ComponentNode;
        }

        if (sceneNode.type === "GROUP") {
            convertedSceneNode = sceneNode as GroupNode;
        }

        if (sceneNode.type === "INSTANCE") {
            convertedSceneNode = sceneNode as InstanceNode;
        }

        if (convertedSceneNode !== null && convertedSceneNode.children.length) {
            const childSelectionTexts = await getSelectionTexts(convertedSceneNode.children);
            res = res.concat(childSelectionTexts);
        }
    }

    return res;
}

async function getSelectionData(fonts: FontData[]) {
    try {
        const currentSelectionNodes = await getSelectionTexts(figma.currentPage.selection);

        return <SelectionData> {
            defaultFont: getMostUsageFontData(currentSelectionNodes, fonts)
        };
    } catch (error) {
        console.log("ERROR: while loading selection info - ", error);
    }
}

async function requestInitialInfo(selectionData: SelectionData, fonts: FontData[]) {
    sendInitialInfo(<InitialInfo> {
        selection: selectionData,
        fonts: fonts
    });
}

async function main() {
    const fonts = await loadFonts();
    const selectionData = await getSelectionData(fonts);
    await requestInitialInfo(selectionData, fonts);
}

main();