import { useContext } from "react";
import { formatFontData } from "../../../shared/font";
import { UIConvertData } from "../dto";
import { UnifontContext } from "../Unifont";
import TagItem from "./TagItem";

function ConvertItem(props) {
    const item: UIConvertData = props.item;
    const additionalClassName = props.className;
    const setSelect = useContext(UnifontContext).setSelect;

    const tagList = item.tags.map(tagId => (
        <TagItem tagId={tagId}/>
    ))

    return (
        <>
        <li
            className={`item container flex-column hover-pointer hover-bg ${additionalClassName}`}
            onClick={() => setSelect(item.id)}
        >
            <div className="container flex-row align-center flex-1">
                {tagList}
            </div>
            <div className="container flex-row align-center flex-1">
                <span className="font-bold font-size-1_1">
                    {formatFontData(item.font)}
                </span>
            </div>
        </li>
        </>
    );
}

export default ConvertItem