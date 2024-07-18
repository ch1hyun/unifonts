import { DefaultNumber, Tag, UnicodeType } from "../../shared/dto";
import { StorageKeys } from "../../shared/network-type";

export async function addStorageTag(tag: Tag): Promise<void> {
    const tags: Tag[] = await getTags();

    await figma.clientStorage.setAsync(StorageKeys.TAG_ITEMS, tags.concat(tag));
}

export async function updateStorageTag(tag: Tag): Promise<void> {
    const tags: Tag[] = await getTags();
    const idx: number = tags.map(t => t.id).indexOf(tag.id);

    await figma.clientStorage.setAsync(StorageKeys.TAG_ITEMS, [
        ...tags.slice(0, idx),
        tag,
        ...tags.slice(idx + 1)
    ]);
}

export async function deleteStorageTag(tag: Tag): Promise<void> {
    const tags: Tag[] = await getTags();
    const idx: number = tags.map(t => t.id).indexOf(tag.id);
    
    await figma.clientStorage.setAsync(StorageKeys.TAG_ITEMS, [
        ...tags.slice(0, idx),
        ...tags.slice(idx + 1)
    ]);
}

export async function getTags(): Promise<Tag[]> {
    let ret = await figma.clientStorage.getAsync(StorageKeys.TAG_ITEMS);
    return ret === undefined ? [] : ret as Tag[];
}

export async function eraseStorageTagIfInvalid(tags: Tag[]): Promise<Tag[]> {
    if (tags.length === 0) return tags;

    let ret: Tag[] = tags.filter(t =>
        t.name.length !== 0 &&
        t.unicodes.filter(u =>
            u.type === UnicodeType.Empty ||
            (u.type === UnicodeType.Single && u.from === DefaultNumber) ||
            (u.type === UnicodeType.Range && u.from >= u.to)
        ).length === 0
    );

    await figma.clientStorage.setAsync(StorageKeys.TAG_ITEMS, ret);
    return ret;
}