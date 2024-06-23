
export enum NodeType {
    Root = 'Root',
    Frame = 'Frame',
    Component = 'Component',
    Group = 'Group',
    Instance = 'Instance',
};

export type ParentNode = FrameNode | ComponentNode | GroupNode | InstanceNode;

export type SelectionNode = {
    parentType: NodeType;
    parentNode: ParentNode;
    node: TextNode;
};

export const DefaultSelectionNode: SelectionNode = {
    parentType: NodeType.Root,
    parentNode: null,
    node: null
};