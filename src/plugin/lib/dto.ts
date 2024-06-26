
export type ParentNode = PageNode | FrameNode | ComponentNode | GroupNode;

export type SelectionNode = {
    parentNode: ParentNode;
    node: TextNode;
};