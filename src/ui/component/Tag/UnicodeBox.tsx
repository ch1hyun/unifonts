import { useContext } from "react";
import { DefaultUnicodeType, Unicode } from "../../../shared/dto";
import { UnifontContext } from "../Unifont";
import UnicodeItem from "./UnicodeItem";

function UnicodeBox(props) {
    const addSelectedTagUnicode = useContext(UnifontContext).addSelectedTagUnicode;

    const unicodes: Unicode[] = props.unicodes;

    const unicodeList = unicodes.map((u, i) => (
        <UnicodeItem unicode={u} index={i}/>
    ))

    function addUnicode() {
        addSelectedTagUnicode({
            ...DefaultUnicodeType
        });
    }

    return (
        <>
        <div className="container flex-column flex-grow">
            {unicodeList}
            <div className="item container flex-column flex-justify-center align-center hover-pointer hover-bg" onClick={() => addUnicode()}>
                <span className="font-bold font-size-1_1">+</span>
            </div>
        </div>
        </>
    );
}

export default UnicodeBox