

// Instance node type cannot resolve constraint problem...
export type ParentNode = PageNode | FrameNode | ComponentNode | GroupNode;// | InstanceNode;

export type SelectionNode = {
    parentNode: ParentNode;
    node: TextNode;
};