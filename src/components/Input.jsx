export default function Input({
    type = 'text',
    className = 'form-control',
    placeholder,
    onChange,
    title = '',
    value
}) {
    return (
        <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
                {title}
            </span>
            <input
                type={type}
                className={className}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={value}
            />
        </div>
    );
}
