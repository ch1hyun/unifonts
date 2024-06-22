import { useContext } from "react";
import { Tag } from "../../../shared/dto";
import { UnifontContext } from "../Unifont";
import { UIConvertData } from "../dto";
import TagBox from "./TagBox";
import FontBox from "./FontBox";
import { formatFontData } from "../../../shared/font";

function EditConvert() {

    const tags: Tag[] = useContext(UnifontContext).tags;
    const selected: UIConvertData = useContext(UnifontContext).selected;

    if (selected === null) {
        return (
            <>
                <div className="container flex-column flex-1"></div>
            </>
        );
    }

    const selectedTags: Tag[] = tags.filter(t => selected.tags.indexOf(t.id) !== -1);
    const restrictBox = selected.type === "default" ? (<><div className="restricted-tagbox"></div></>) : (<></>);
    // console.log(
    //     "selected >> {" +
    //     "\n\tid : " + selected.id + "," + 
    //     "\n\ttype : " + selected.type + "," + 
    //     "\n\ttag length : " + selected.tags.length + "," + 
    //     "\n\tfont : " + formatFontData(selected.font) + "," + 
    //     "}"
    // );

    return (
        <>
        <div className="container flex-column flex-1">
            <TagBox type="selected" message="Selected : " tags={selectedTags}/>
            <TagBox type="exists" message="Exists : " tags={tags}/>
            <FontBox/>
            {restrictBox}
        </div>
        </>
    );
}

export default EditConvert