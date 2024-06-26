import { useRef } from "react";

function Input(props) {
    const message: string = props.message;
    const type: string = props.type;
    const value: string = props.value;
    const placeholder: string = props.placeholder;
    const changeHandler = props.changeHandler;

    const inputRef = useRef(null);

    /* Handler Functions */

    function handleChange(val: string) {
        if (val.length === 0) {
            if (!inputRef.current.classList.contains("not-valid")) {
                inputRef.current.classList.add("not-valid");
            }
        } else if (inputRef.current.classList.contains("not-valid")) {
            inputRef.current.classList.remove("not-valid");
        }

        changeHandler(val);
    }

    return (
        <>
        <p className="font-bold">{message}</p>
        <input
            className={`${value.length === 0 ? "not-valid" : ""}`}
            type={type}
            placeholder={placeholder}
            onChange={(e) => handleChange(e.target.value)}
            value={value}
            ref={inputRef}
        />
        </>
    );
}

export default Input