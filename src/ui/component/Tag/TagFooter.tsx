
function TagFooter(props) {
    const name = props.name;
    const handleClick = props.clickHandler;

    return (
        <>
        <div className="footer flex-row">
            <div className="container flex-row reverse flex-grow align-center">
                <button className="button dark margin-right-5" onClick={() => handleClick()}>
                    {name}
                </button>
            </div>
        </div>
        </>
    );
}

export default TagFooter