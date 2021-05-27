export default function ButtonSwtich({ text, active = false, handleClick, id }) {
    const classlist = 'btn ';
    return (
        <>
            <button
                onClick={() => handleClick(id)}
                type="button"
                className={active ? `${classlist} btn-primary` : classlist}
                aria-current="true"
            >
                {text}
            </button>
        </>
    );
}
