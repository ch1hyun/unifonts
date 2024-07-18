import { useContext } from "react";
import { Tag } from "../../../shared/dto";
import TagItem from "./TagItem";
import { UnifontContext } from "../Unifont";
import { DEFAULT_TAG_ID } from "../InitData/initDataProvider";

function TagBox(props) {
    const type: string = props.type;
    const message: string = props.message;
    const tags: Tag[] = props.tags;

    const addTag = useContext(UnifontContext).addTag;
    const deleteTag = useContext(UnifontContext).deleteTag;

    /* Handler Functions */

    let handler = () => {alert("Error")};
    if (type === "selected") handler = deleteTag;
    else if (type === "exists") handler = addTag;

    const tagList = tags.filter(t => type !== "exists" || t.id !== DEFAULT_TAG_ID).map(t => (
        <TagItem tagId={t.id} clickHandler={handler}/>
    ));

    return (
        <>
        <p className="font-bold">{message}</p>
        <div className="tagbox container flex-row align-center border-bottom">
            {tagList}
        </div>
        </>
    );
}

export default TagBox