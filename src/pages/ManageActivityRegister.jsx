import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin } from '../api/authentication';
import AlertLogin from '../components/AlertLogin';
import { fetchRegisterActivityThunk, removeRegisterActivityThunk } from '../store/reducers/ActivitySlide';
import NewsRowTable from '../components/NewsRowTable';
import ModelBrowseFile from '../components/ModelBrowseFile';

function ManageActivityRegister() {
    const listActivity = useSelector((state) => state.activitis.value);
    const dispatch = useDispatch();
    const [activity, setActivity] = useState('')
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
            <ModelBrowseFile
                show={showBrowseFile}
                setShow={setShowBrowseFile}
                activity={activity} />
            <AlertLogin show={show} setShow={setShow} />
        </div>
    );
}
export default ManageActivityRegister;
