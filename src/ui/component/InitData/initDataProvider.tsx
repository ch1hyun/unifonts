import { Tag } from "../../../shared/dto";
import * as fs from 'fs';

const TAG_FILE_NAME = 'tag.json';
const FILE_TYPE_UTF8 = 'utf8';

export function getInitialTagData(): Tag[] {
    let tags: Tag[] = [];

    let fileContent = fs.readFileSync(TAG_FILE_NAME, FILE_TYPE_UTF8);
    let tagsJson: Tag[] = JSON.parse(fileContent);

    let tagId = 1;
    tagsJson.map(tj => tags.push({
        ...tj,
        id: tagId++
    }));

    // TODO : Load tags from figma local storage (cache)

    return tags;
}