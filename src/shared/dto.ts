/* Primitive Values */
export const DefaultNumber: number = -1;
export const DefaultString: string = "";

/* Types */
export enum TagType {
    Default = 'Default',
    Custom = 'Custom',
};

/* Unicodes */
export enum UnicodeType {
    Empty = 'Empty',
    Default = 'Default',
    Single = 'Single',
    Range = 'Range',
};

export type Unicode = {
    type: UnicodeType;
    from?: number;
    to?: number;
};
export const DefaultUnicodeType: Unicode = {
    type: UnicodeType.Empty,
    from: DefaultNumber,
    to: DefaultNumber
};

export type Tag = {
    id: number;
    type: TagType;
    name: string;
    color: string;
    unicodes: Unicode[];
};
export const DefaultTagType: Tag = {
    id: DefaultNumber,
    type: TagType.Custom,
    name: DefaultString,
    color: DefaultString,
    unicodes: [{
        ...DefaultUnicodeType
    }]
};

/* End */ 

/* Font */
export type LocalStyle = {
    id: string;
    name: string
};
export const DefaultLocalStyleType: LocalStyle = {
    id: DefaultString,
    name: DefaultString
};

export type FontData = {
    id: number;
    fontName: FontName;
    isLocalStyle: boolean;
    localStyle?: LocalStyle;
};
export const DefaultFontDataType: FontData = {
    id: DefaultNumber,
    fontName: null,
    isLocalStyle: true,
    localStyle: {
        ...DefaultLocalStyleType
    }
};
/* End */

/* Selection */
export type SelectionData = {
    defaultFont: FontData;
    usedFonts: FontName[];
};
/* End */

/* Convert */
export type ConvertData = {
    unicodes: Unicode[];
    font: FontData;
};

export const DefaultConvertData: ConvertData = {
    unicodes: [],
    font: {
        ...DefaultFontDataType
    }
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

/* DTO Functions */
export function isSameUnicode(o: Unicode, t: Unicode): boolean {
    if (o.type !== t.type) return false;
    if (
        o.type === UnicodeType.Empty ||
        t.type === UnicodeType.Empty ||
        o.type === UnicodeType.Default ||
        t.type === UnicodeType.Default
    ) return false;
    if (
        o.type === UnicodeType.Single &&
        o.from !== t.from
    ) return false;
    if (
        o.type === UnicodeType.Range &&
        (
            o.from !== t.from ||
            o.to !== t.to
        )
    ) return false;

    return true;
}

export function isSameLocalStyle(o: LocalStyle, t: LocalStyle): boolean {
    return (
        o.id === t.id
    );
}

export function defaultStringToDefaultNumber(s: string): number {
    if (s.length === 0) return DefaultNumber;
    return Number("0x" + s);
}

export function defaultNumberToDefaultString(n: number): string {
    if (n === DefaultNumber) return "";
    return n.toString(16);
}