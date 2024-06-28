import { FontData } from "../../../shared/dto";
import { formatFontData } from "../../../shared/font";

function FontItem(props) {

    const font: FontData = props.font;
    const handleChange = props.changeHandler;
    const checked: boolean = props.checked;
    const hidden: boolean = props.hidden;
    
    return (
        <>
        <label className={`font-item flex-row align-center font-bold font-size-1_1 hover-pointer hover-bg ${hidden ? "hidden" : ""}`}>
            <input className="margin-right-5" type="radio" name="font" onChange={() => handleChange(font.id)} checked={checked}/>
            {formatFontData(font)}
        </label>
        </>
    );
}

export default FontItem