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
    handleConfirm,
    handleCancelConfirm,
    handleProof,
    index,
    id,
    buttons,
    email,
    userId,
    confirm,
    images,
    proof,
}) {
    return (
        <tr>
            {name && (
                <th>
                    <Link to={id}>{name}</Link>
                </th>
            )}
            {email && <td>{email}</td>}
            {proof != undefined && (
                <td>
                    {proof || images.length
                        ? 'Đã thêm minh chứng'
                        : 'Chưa có minh chứng'}
                </td>
            )}
            {confirm != undefined && (
                <td>{confirm ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>
            )}
            {userId && <td>{userId}</td>}
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
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                    >
                        {buttons.map(({ handle, ...rest }, i) => (
                            <input
                                key={i}
                                onClick={() => handle(index)}
                                {...rest}
                            />
                        ))}
                    </div>
                </td>
            )}
            {handleConfirm && handleProof && (
                <td>
                    <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic mixed styles example"
                    >
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleProof(index)}
                            disabled={proof || images.length ? false : true }
                        >
                            {'Xem minh chứng'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => handleConfirm(index, !confirm)}
                        >
                            {!confirm ? 'Xác nhận': 'Hủy XN'}
                        </button>
                    </div>
                </td>
            )}
        </tr>
    );
}
