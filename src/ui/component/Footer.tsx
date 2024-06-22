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


    if (page === "main") {
        return (
            <>
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
                    <button className="button dark">
                        Confirm
                    </button>
                </div>
            </div>
            </>
        );
    }
    else if (page === "tag") {
        return (
            <>
                <div className="footer flex-row border-top padding">
                    <div className="container flex-row flex-1 align-center">
                        <button className="button" onClick={() => handlePage("main")}>
                            Back
                        </button>
                    </div>
                </div>
            </>
        );
    }
    else {
        return (
            <>
            <p>Error</p>
            </>
        );
    }
}

export default Footer