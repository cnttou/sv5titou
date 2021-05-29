import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin } from '../api/authentication';
import AlertLogin from '../components/AlertLogin';
import { fetchRegisterActivityThunk, removeRegisterActivityThunk } from '../store/reducers/ActivitySlide';
import NewsRowTable from '../components/NewsRowTable';

function ManageActivityRegister() {
    const listActivity = useSelector((state) => state.activitis.value);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    useEffect(async () => {
        if ((await checkLogin()) == false) {
            setShow(true);
            return;
        }
        dispatch(fetchRegisterActivityThunk());
    }, []);
    const handleRemoveActivity = (id) => {
        dispatch(removeRegisterActivityThunk(id));
    };
    const handleAddProof = () => {};

    const buttons = [
        {
            handle: handleAddProof,
            text: 'Minh chứng',
            color: 'primary',
        },
        {
            handle: handleRemoveActivity,
            text: 'Hủy đăng kí',
            color: 'danger',
        },
    ];
    return (
        <div className="container">
            {listActivity?.length ? (
                <>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Tên</th>
                                <th scope="col">Thời gian</th>
                                <th scope="col">Địa điểm</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listActivity?.length &&
                                listActivity.map((c, i) => (
                                    <NewsRowTable
                                        buttons={buttons}
                                        {...c}
                                        index={i}
                                        key={i}
                                    />
                                ))}
                        </tbody>
                    </table>
                </>
            ) : (
                'Loading'
            )}
            <AlertLogin show={show} setShow={setShow} />
        </div>
    );
}
export default ManageActivityRegister;
