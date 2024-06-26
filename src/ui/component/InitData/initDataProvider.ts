import { Tag } from "../../../shared/dto";
import tagsData from "./tag.json";

const TAG_FILE_NAME = 'tag.json';
const FILE_TYPE_UTF8 = 'utf8';

export function getInitialTagData(): Tag[] {
    let tags: Tag[] = [];


    let tagId = 1;
    (tagsData as Tag[]).map(tj => tags.push({
        ...tj,
        id: tagId++
    }));

    // TODO : Load tags from figma local storage (cache)

    return tags;
}