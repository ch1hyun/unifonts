import { useContext } from "react";
import { UnifontContext } from "../Unifont";
import { UIConvertData } from "../dto";
import ConvertItem from "./ConvertItem";

function ConvertList() {

    const defaultConvert: UIConvertData = useContext(UnifontContext).defaultConvert;
    const converts: UIConvertData[] = useContext(UnifontContext).converts;
    const selected: UIConvertData = useContext(UnifontContext).selected;

    const addConvert = useContext(UnifontContext).addConvert;

    const defaultItem = (
        <ConvertItem item={defaultConvert} className={`border-bottom ${selected !== null && selected.id === defaultConvert.id ? "focus" : ""}`}/>
    );

    const convertItems = converts.map(c => (
        <ConvertItem item={c} className={`${selected !== null && selected.id === c.id ? "focus" : ""}`}/>
    ));

    return (
        <>
        <div className="container flex-column flex-1 border-right">
            <ul>
                {defaultItem}
            </ul>
            <ul className="container flex-column">
                {convertItems}
                <div className="item container flex-column flex-justify-center align-center hover-pointer hover-bg" onClick={() => addConvert()}>
                    <span className="font-bold font-size-1_1">+</span>
                </div>
            </ul>
        </div>
        </>
    );
}

export default ConvertList