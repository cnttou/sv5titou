import { Link } from 'react-router-dom';

export default function NewsRowTable({
    name,
    target,
    numPeople,
    date,
    location,
    summary,
    handleEdit,
    handleDelete,
    index,
    id,
    buttons
}) {
    return (
        <tr>
            <th>
                <Link to={id}>{name}</Link>
            </th>
            {target && <td>{target}</td>}
            {date && <td>{date}</td>}
            {location && <td>{location}</td>}
            {numPeople && <td>{numPeople}</td>}
            {handleDelete && handleEdit && (
                <td>
                    <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic mixed styles example"
                    >
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => handleEdit(index)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(index)}
                        >
                            Delete
                        </button>
                    </div>
                </td>
            )}
            {buttons?.length && (
                <td>
                    <div
                        class="btn-group"
                        role="group"
                        aria-label="Basic example"
                    >
                        {buttons.map((c, i) => (
                            <button
                                key={i}
                                type="button"
                                className={
                                    c?.color ? 'btn btn-' + c.color : 'btn'
                                }
                                onClick={() => c.handle(id)}
                            >
                                {c.text}
                            </button>
                        ))}
                    </div>
                </td>
            )}
        </tr>
    );
}
