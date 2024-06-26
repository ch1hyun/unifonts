import { useContext } from "react";
import { UnifontContext } from "./Unifont";
import { requestToPlugin } from "../lib/network/request";
import { MessagePayload, RequestTypes } from "../../shared/network-type";
import { InitContext } from "../App";

function Footer() {
    const page = useContext(UnifontContext).page;
    const setPage = useContext(UnifontContext).setPage;
    const isValidSelected = useContext(UnifontContext).isValidSelected;
    const isValidSelectedTag = useContext(UnifontContext).isValidSelectedTag;
    const close = useContext(InitContext).close;
    const requestConvertEntry = useContext(UnifontContext).requestConvertEntry;

    /* Handler Functions */ 

    function handlePage(name) {
        if (
            (
                page === "main" &&
                (
                    name === "main" ||
                    !isValidSelected()
                )
            ) ||
            (page === "tag" &&
                (
                    name === "tag" ||
                    !isValidSelectedTag()
                )
            )
        ) {
            return;
        }

        setPage(name);
    }

    /* Returns */

    let ret = (<><p>Error</p></>);

    if (page === "main") {
        ret = (
            <div className="footer flex-row border-top padding">
                <div className="container flex-row flex-1 align-center">
                    <button className="button" onClick={() => close()}>
                        Cancel
                    </button>
                </div>
                <div className="container flex-row reverse flex-1 align-center">
                    <button className="button margin-right-5" onClick={() => handlePage("tag")}>
                        Tag
                    </button>
                    <button className="button dark" onClick={() => requestConvertEntry()}>
                        Confirm
                    </button>
                </div>
            </div>
        );
    } else if (page === "tag") {
        ret = (
                <div className="footer flex-row border-top padding">
                    <div className="container flex-row flex-1 align-center">
                        <button className="button" onClick={() => handlePage("main")}>
                            Back
                        </button>
                    </div>
                </div>
        );
    }

    return (
        <>
        {ret}
        </>
    );
}

export default Footer