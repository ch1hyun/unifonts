import { useContext, useRef } from "react";
import Input from "./Input";
import UnicodeBox from "./UnicodeBox";
import { UnifontContext } from "../Unifont";
import { Tag } from "../../../shared/dto";
import TagFooter from "./TagFooter";

function EditTag() {

    const selectedTag: Tag = useContext(UnifontContext).selectedTag;

    if (selectedTag === null) {
        return (
            <>
            <div className="container flex-column flex-1 padding"></div>
            </>
        );
    }

    const changeSelectedTagName = useContext(UnifontContext).changeSelectedTagName;
    const changeSelectedTagColor = useContext(UnifontContext).changeSelectedTagColor;
    const deleteTagItem = useContext(UnifontContext).deleteTagItem;

    return (
        <>
        <div className="container flex-column flex-1 padding">
            <Input message="Name : " type="text" value={selectedTag.name} placeholder="Input Name..." changeHandler={changeSelectedTagName}/>
            <Input message="Background Color : " type="color" value={selectedTag.color} placeholder="" changeHandler={changeSelectedTagColor}/>
            <UnicodeBox unicodes={selectedTag.unicodes}/>
            <TagFooter name="delete" clickHandler={deleteTagItem}/>
        </div>
        </>
    );
}

export default EditTag