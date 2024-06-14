/* Unicodes */
export type Single = "single";
export type Range = "range";
export type UnicodeTypes = Single | Range;

export type Unicode = {
    type: UnicodeTypes;
    from: number;
    to?: number;
};

export type Tag = {
    name: string;
    color: string;
    unicode: Unicode;
};

/* End */ 

/* Font */
export type LocalStyle = {
    id: string;
    name: string
};

export type FontData = {
    fontName: FontName;
    isLocalStyle: boolean;
    localStyle?: LocalStyle;
};
/* End */

/* Selection */
export type SelectionData = {
    defaultFont: FontData;
};
/* End */

/* Convert */
export type ConvertData = {
    unicode: Unicode;
    fonts: FontData[];
};
export type ConvertInfo = {
    converts: ConvertData[];
    fonts: FontName[];
};
/* End */

/* Initial */
export type InitialInfo = {
    selection: SelectionData;
    fonts: FontData[];
};
/* End */