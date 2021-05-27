
export default function Select({title='', list=[], placeholder='', onChange, value}) {
    return (
        <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
                {title}
            </span>
            <select
                className="form-select"
                aria-label="Default select example"
                onChange={e=>onChange(e.target.value)}
                value={value}
                placeholder={placeholder}
            >
                {list.map((c, i) => (
                    <option key={i} value={c?.value}>
                        {c?.text}
                    </option>
                ))}
            </select>
        </div>
    );
}
