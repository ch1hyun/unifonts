import { useContext, useRef } from "react";
import { formatFontData } from "../../../shared/font";
import { UIConvertData } from "../dto";
import { UnifontContext } from "../Unifont";
import TagItem from "./TagItem";

function ConvertItem(props) {
    const item: UIConvertData = props.item;
    const additionalClassName = props.className;
    const setSelect = useContext(UnifontContext).setSelect;
    const deleteConvert = useContext(UnifontContext).deleteConvert;
    
    /* Refs */

    const deleteBtn = useRef(null);

    const tagList = item.tags.map(tagId => (
        <TagItem tagId={tagId}/>
    ))

    /* Handler Functions */

    function handleEnter() {
        if (item.id === 1) return;
        if (deleteBtn.current.classList.contains("hidden")) {
            deleteBtn.current.classList.remove("hidden");
        }
    }

    function handleLeave() {
        if (item.id === 1) return;
        if (!deleteBtn.current.classList.contains("hidden")) {
            deleteBtn.current.classList.add("hidden");
        }
    }

    return (
        <>
        <li
            key={item.id}
            className={`item container flex-column hover-pointer hover-bg ${additionalClassName}`}
            onClick={() => setSelect(item.id)}
            onMouseEnter={() => handleEnter()}
            onMouseLeave={() => handleLeave()}
        >
            <div className="container flex-row align-center flex-1">
                {tagList}
            </div>
            <div className="container flex-row align-center flex-1">
                <span className="font-bold font-size-1_1">
                    {formatFontData(item.font)}
                </span>
            </div>
            {
                item.id === 1 ? (<></>) :
                (<div className="delete-item hover-pointer hidden" ref={deleteBtn} onClick={() => deleteConvert(item.id)}><span>✕</span></div>)
            }
        </li>
        </>
    );
}

export default ConvertItem