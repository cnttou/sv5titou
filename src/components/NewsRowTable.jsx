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
    id
}) {
    return (
        <tr>
            <th scope="row">
                <Link to={id}>{name}</Link>
            </th>
            <td>{target}</td>
            <td>{date}</td>
            <td>{location}</td>
            <td>{numPeople}</td>
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
        </tr>
    );
}
