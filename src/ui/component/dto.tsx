import { DefaultFontDataType, DefaultNumber, FontData, Tag } from "../../shared/dto";

export type GeneralConvert = "general";
export type DefaultConvert = "default";
export type UIConvertType = GeneralConvert | DefaultConvert;

export type UIConvertData = {
    id: number;
    type: UIConvertType;
    tags: number[];
    font: FontData;
};

export const DefaultUIConvertData: UIConvertData = {
    id: DefaultNumber,
    type: "general",
    tags: [],
    font: {
        ...DefaultFontDataType
    }
};

export type UITagMap = {
    tagId: number;
    convertDataId: number[];
};

export const DefaultUITagMap: UITagMap = {
    tagId: DefaultNumber,
    convertDataId: []
};