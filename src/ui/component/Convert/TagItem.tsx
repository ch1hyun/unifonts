import { useContext } from "react";
import { Tag } from "../../../shared/dto";
import { UnifontContext } from "../Unifont";

function TagItem(props) {
    const tags: Tag[] = useContext(UnifontContext).tags;
    const tagId: string = props.tagId;
    const tag: Tag = tags.filter(t => t.id === tagId)[0];

    const additionalClassName:string = props.className;
    const handleClick = props.clickHandler;

    return (
        <>
        <button className={`button tag margin-right-5 hover-pointer ${additionalClassName}`} style={{backgroundColor: tag.color}} onClick={() => handleClick(tag.id)}>
            <blockquote>
                {tag.name}
            </blockquote>
        </button>
        </>
    );
}

export default TagItem
