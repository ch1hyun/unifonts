import { useContext } from "react";
import { UnifontContext } from "../Unifont";
import TagItem from "../Convert/TagItem";
import { Tag, TagType } from "../../../shared/dto";
import TagFooter from "./TagFooter";

function TagList() {
    const tags: Tag[] = useContext(UnifontContext).tags.filter(t => t.id !== 1);
    const selectedTag: Tag = useContext(UnifontContext).selectedTag;

    const setSelectTag = useContext(UnifontContext).setSelectTag;
    const addTagItem = useContext(UnifontContext).addTagItem;

    const tagList = tags.filter(t => t.type !== TagType.Default).map(t => (
        <TagItem tagId={t.id} className={`margin-bottom-5 ${selectedTag !== null && selectedTag.id === t.id ? "tag-select" : ""}`} clickHandler={setSelectTag}/>
    ));

    return (
        <>
        <div className="container flex-column flex-1 padding border-right">
            <div className="container flex-row flex-grow flex-align-start flex-wrap">
                {tagList}
            </div>
            <TagFooter name="Add" clickHandler={addTagItem}/>
        </div>
        </>
    );
}

export default TagList