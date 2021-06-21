function ButtonSwtich({ text, active = false, handleClick, id }) {
    const onClick = () => {
        handleClick(id);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={active ? 'btn btn-primary' : 'btn'}
            aria-current="true"
        >
            {text}
        </button>
    );
}
export default ButtonSwtich;
