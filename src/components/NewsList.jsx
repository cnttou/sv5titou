export default function NewsList({
    name,
    target,
    numPeople,
    date,
    location,
    summary,
    handleEdit,
    handleDelete,
    index,
}) {
    return (
        <tr>
            <th scope="row">{name}</th>
            <td>{target}</td>
            <td>{date}</td>
            <td>{location}</td>
            <td>{numPeople}</td>
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
        </tr>
    );
}
