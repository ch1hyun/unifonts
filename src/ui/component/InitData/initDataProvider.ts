import { Tag } from "../../../shared/dto";
import tagsData from "./tag.json";

const TAG_FILE_NAME = 'tag.json';
const FILE_TYPE_UTF8 = 'utf8';
export const DEFAULT_TAG_ID = "38B937894ACE4C8E2C7F95C02C92EFF20E952841EF86D8F9AA8AFB6FE7C051D3";

export function getInitialTagData(): Tag[] {
    let tags: Tag[] = [...(tagsData as Tag[])];

    // TODO : Load tags from figma local storage (cache)

    return tags;
}