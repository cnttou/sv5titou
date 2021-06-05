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
    const listActivity = useSelector((state) => state.activitis.value);
    const dispatch = useDispatch();
    const [activity, setActivity] = useState('');
    const [show, setShow] = useState(false);
    const [showBrowseFile, setShowBrowseFile] = useState(false);

    useEffect(async () => {
        if ((await checkLogin()) == false) {
            setShow(true);
            return;
        }
        dispatch(fetchRegisterActivityThunk());
    }, []);
    const handleRemoveActivity = (index) => {
        dispatch(removeRegisterActivityThunk(listActivity[index].id));
    };
    const handleAddProof = (index) => {
        setActivity(listActivity[index]);
        setShowBrowseFile(true);
    };

    const buttons = [
        {
            handle: handleAddProof,
            type: 'button',
            value: 'Minh chứng',
            className: 'btn btn-primary',
        },
        {
            handle: handleRemoveActivity,
            type: 'button',
            value: 'Hủy đăng kí',
            className: 'btn btn-danger',
        },
    ];
    const loadTable = (listActivity = []) => (
        <table className="table table-bordered table-hover">
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
        <div className="container">
            {listActivity?.length ? loadTable(listActivity) : <Loading />}
            {showBrowseFile && (
                <ModelBrowseFile
                    show={showBrowseFile}
                    setShow={setShowBrowseFile}
                    activity={activity}
                />
            )}
            {show && <AlertLogin show={show} setShow={setShow} />}
        </div>
    );
}
export default ManageActivityRegister;
