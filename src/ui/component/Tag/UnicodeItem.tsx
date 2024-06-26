import { useContext, useRef } from "react";
import { DefaultNumber, Tag, Unicode, UnicodeType, defaultNumberToDefaultString, defaultStringToDefaultNumber } from "../../../shared/dto";
import { isHexCodes } from "../../../shared/util";
import { UnifontContext } from "../Unifont";

function UnicodeItem(props) {

    const selectedTag: Tag = useContext(UnifontContext).selectedTag;
    const updateSelectedTagUnicode = useContext(UnifontContext).updateSelectedTagUnicode;
    const deleteSelectedTagUnicode = useContext(UnifontContext).deleteSelectedTagUnicode;

    const item: Unicode = props.unicode;
    const itemIdx: number = props.index;

    /* Refs */

    const fromRef = useRef(null);
    const toRef = useRef(null);
    const deleteBtn = useRef(null);

    /* Handler Functions */

    function handleEnter() {
        if (deleteBtn.current.classList.contains("hidden")) {
            deleteBtn.current.classList.remove("hidden");
        }
    }

    function handleLeave() {
        if (!deleteBtn.current.classList.contains("hidden")) {
            deleteBtn.current.classList.add("hidden");
        }
    }

    function fromValid() {
        if (fromRef.current.classList.contains("not-valid")) {
            fromRef.current.classList.remove("not-valid");
        }
    }
    function fromInvalid() {
        if (!fromRef.current.classList.contains("not-valid")) {
            fromRef.current.classList.add("not-valid");
        }
    }

    function toValid() {
        if (toRef.current.classList.contains("not-valid")) {
            toRef.current.classList.remove("not-valid");
        }
    }
    function toInvalid() {
        if (!toRef.current.classList.contains("not-valid")) {
            toRef.current.classList.add("not-valid");
        }
    }

    function handleFromChange() {
        if (fromRef.current.value.length > 0 && !isHexCodes(fromRef.current.value)) {
            fromInvalid(); return;
        } else if (fromRef.current.value.length !== 0) fromValid();

        update();
    }

    function handleToChange() {
        if (toRef.current.value.length > 0 && !isHexCodes(toRef.current.value)) {
            toInvalid(); return;
        } else toValid();

        update();
    }

    function update() {
        let fromVal: number = defaultStringToDefaultNumber(fromRef.current.value.trim());
        let toVal: number = defaultStringToDefaultNumber(toRef.current.value.trim());
        let type: UnicodeType = UnicodeType.Empty;

        if (fromVal !== DefaultNumber) type = UnicodeType.Single;
        if (type === UnicodeType.Single && toVal !== DefaultNumber) type = UnicodeType.Range; 

        if (type === UnicodeType.Empty ||
            (type === UnicodeType.Single && fromVal === DefaultNumber) ||
            (type === UnicodeType.Range && fromVal >= toVal)
        ) {
            fromInvalid(); toInvalid();
        } else {
            fromValid(); toValid();
        }

        updateSelectedTagUnicode(itemIdx, {
            type: type,
            from: fromVal,
            to: toVal
        });
    }

    function deleteUnicode() {
        if (selectedTag.unicodes.length === 1) {
            alert("Each tag must have unicode at least one");
            return;
        }

        deleteSelectedTagUnicode(itemIdx);
    }

    return (
        <>
        <div className="item container flex-row align-center flex-justify-center padding border-bottom overflow-hidden" onMouseEnter={() => handleEnter()} onMouseLeave={() => handleLeave()}>
            <span className="margin-right-5 font-bold">U+</span>
            <input className={`margin-right-5 width-85 ${item.type === UnicodeType.Empty ? "not-valid" : ""}`} type="text" value={defaultNumberToDefaultString(item.from)} placeholder="hex up to 5" ref={fromRef} onChange={() => handleFromChange()} maxLength={5}/>
            <span className="margin-right-5 font-bold">-</span>
            <input className="margin-right-5 width-85" type="text" value={defaultNumberToDefaultString(item.to)} placeholder="hex up to 5" ref={toRef} onChange={() => handleToChange()} maxLength={5}/>
            <div className="delete-item hover-pointer hidden" ref={deleteBtn} onClick={() => deleteUnicode()}><span>✕</span></div>
        </div>
        </>
    );
}

export default UnicodeItem