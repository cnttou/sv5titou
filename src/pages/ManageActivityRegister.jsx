import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin } from '../api/authentication';
import AlertLogin from '../components/AlertLogin';
import {
    fetchRegisterActivityThunk,
    removeRegisterActivityThunk,
} from '../store/reducers/ActivitySlide';
import NewsRowTable from '../components/NewsRowTable';
import ModelBrowseFile from '../components/ModelBrowseFile';
import Loading from '../components/Loading';

function ManageActivityRegister() {
    const listActivity = useSelector((state) => state.activities.value);
    const loading = useSelector((state) => state.activities.loading);

    const dispatch = useDispatch();
    const [activity, setActivity] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(async () => {
        if ((await checkLogin()) == false) {
            setShowAlert(true);
            return;
        } else dispatch(fetchRegisterActivityThunk());
    }, []);
    const handleRemoveActivity = (index) => {
        dispatch(removeRegisterActivityThunk(listActivity[index].id));
    };
    const handleAddProof = (index) => {
        setActivity(listActivity[index]);
    };

    const buttons = [
        {
            handle: handleAddProof,
            type: 'button',
            value: 'Minh chứng',
            className: 'btn btn-primary',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#dialog-browse-file',
        },
        {
            handle: handleRemoveActivity,
            type: 'button',
            value: 'Hủy đăng kí',
            className: 'btn btn-danger',
        },
    ];
    const loadTable = (listActivity = []) => (
        <table className="table table-register-activity table-bordered table-hover">
            <thead>
                <tr className="bg-info">
                    <th scope="col">Tên</th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Địa điểm</th>
                    <th scope="col">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {listActivity.map((c, i) => (
                    <NewsRowTable
                        buttons={buttons}
                        name={c.name}
                        date={c.date}
                        location={c.location}
                        id={c.id}
                        index={i}
                        key={i}
                    />
                ))}
            </tbody>
        </table>
    );
    return (
        <div>
            {loading !== 0 && listActivity?.length === 0 && <Loading />}
            {listActivity?.length !== 0
                ? loadTable(listActivity)
                : 'Bạn chưa đăng ký hoạt động nào!'}

            <ModelBrowseFile activity={activity} />
            {showAlert && (
                <AlertLogin show={showAlert} setShow={setShowAlert} />
            )}
        </div>
    );
}
export default ManageActivityRegister;
