import { Link } from 'react-router-dom';

export default function NewsRowTable({
    name,
    target,
    numPeople,
    date,
    location,
    summary,
    handleConfirm,
    handleCancelConfirm,
    checkRegister,
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
                    {checkRegister && checkRegister(id)}
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
            {buttons?.length && (
                <td>
                    <div
                        className="btn-group btn-group-sm"
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
                        className="btn-group btn-group-sm"
                        role="group"
                        aria-label="Basic mixed styles example"
                    >
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleProof(index)}
                            disabled={proof || images.length ? false : true}
                            data-bs-toggle="modal"
                            data-bs-target="#dialog-browse-file"
                        >
                            {'Xem minh chứng'}
                        </button>
                        <button
                            type="button"
                            className={
                                !confirm ? 'btn btn-success' : 'btn btn-danger'
                            }
                            onClick={() => handleConfirm(index, !confirm)}
                        >
                            {!confirm ? 'Xác nhận' : 'Hủy XN'}
                        </button>
                    </div>
                </td>
            )}
        </tr>
    );
}

// const colorItemPass = (date = '2021-09-10') => {
//     let now = new Date();
//     let d = new Date(date);

//     if (now.getTime() > d.getTime()) {
//         return {
//             backgroundColor: '#A9A9A9',
//             opacity: '0.6',
//         };
//     }
//     return { backgroundColor: 'transparent' };
// };