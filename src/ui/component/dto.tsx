import { DefaultFontDataType, DefaultNumber, DefaultString, FontData, Tag } from "../../shared/dto";

export enum UIConvertType {
    Default = "Default",
    General = "General",
};

export type UIConvertData = {
    id: number;
    type: UIConvertType;
    tags: string[];
    font: FontData;
};

export const DefaultUIConvertData: UIConvertData = {
    id: DefaultNumber,
    type: UIConvertType.General,
    tags: [],
    font: {
        ...DefaultFontDataType
    }
};

export type UITagMap = {
    tagId: string;
    convertDataId: number[];
};

export const DefaultUITagMap: UITagMap = {
    tagId: DefaultString,
    convertDataId: []
};