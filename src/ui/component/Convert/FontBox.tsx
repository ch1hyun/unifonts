import { useContext, useEffect, useState } from "react";
import { InitContext } from "../../App";
import { FontData } from "../../../shared/dto";
import { formatFontData, formatFontName, isSameFontData } from "../../../shared/font";
import FontItem from "./FontItem";
import { UnifontContext } from "../Unifont";
import { UIConvertData } from "../dto";

function FontBox() {

    const selected: UIConvertData = useContext(UnifontContext).selected;
    const changeFont = useContext(UnifontContext).changeFont;
    const fonts: FontData[] = useContext(InitContext).init.fonts;
    const [keyword, setKeyword] = useState("");
    
    const fontList = fonts.map(f => (
        <FontItem font={f} changeHandler={changeFont} checked={selected.font.id === f.id} hidden={!isSearchTarget(f)}/>
    ));

    /* Handler Functions */

    function isSearchTarget(font: FontData): boolean {
        if (keyword.length === 0) return true;

        if (
            formatFontData(font)
                .toLowerCase()
                .includes(keyword.toLowerCase())
        ) return true;

        if (
            formatFontName(font.fontName)
                .toLowerCase()
                .includes(keyword.toLowerCase())
        ) return true;

        return false;
    }

    return (
        <>
        <div className="container flex-column flex-grow">
            <div className="container flex-column overflow-unset">
                <p className="font-bold">Font :</p>
                <input className="search" type="text" placeholder="Search..." onChange={(e) => setKeyword(e.target.value)}/>
            </div>
            <div className="container flex-column flex-grow">
                {fontList}
            </div>
        </div>
        </>
    );
}

export default FontBox