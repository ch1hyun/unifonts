/* Primitive Values */
export const DefaultNumber: number = -1;
export const DefaultString: string = "";

/* Unicodes */
export type EmptyType = "empty";
export type SingleType = "single";
export type RangeType = "range";
export type DefaultType = "default";
export type UnicodeTypes = EmptyType | SingleType | RangeType | DefaultType;

export type Unicode = {
    type: UnicodeTypes;
    from?: number;
    to?: number;
};
export const DefaultUnicodeType: Unicode = {
    type: "empty",
    from: DefaultNumber,
    to: DefaultNumber
};

export type Tag = {
    id: number;
    name: string;
    color: string;
    unicodes: Unicode[];
};
export const DefaultTagType: Tag = {
    id: DefaultNumber,
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
        o.type === "single" &&
        o.from !== t.from
    ) return false;
    if (
        o.type === "range" &&
        (
            o.from !== t.from ||
            o.to !== t.to
        )
    ) return false;

    return true;
}

export function isSameLocalStyle(o: LocalStyle, t: LocalStyle): boolean {
    return (
        o.id === t.id &&
        o.name === t.name
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