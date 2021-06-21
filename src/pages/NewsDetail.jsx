import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { checkLogin } from '../api/authentication';
import { getNewsDocument, registerActivity } from '../api/firestore';
import AlertLogin from '../components/AlertLogin';

export default function NewsDetail() {
    let { id } = useParams();
    const dispatch = useDispatch();
    const [news, setNews] = useState({});
    const [show, setShow] = useState(false);
    let history = useHistory();

    useEffect(() => {
        if (id !== '') {
            getNewsDocument(id).then((data) => setNews(data));
            
        }
    }, [id]);

    const handleRegister = async () => {
        if (await checkLogin())
            dispatch(registerActivity(id, news.name, news.date, news.location));
        else setShow(true);
    };
    return (
        <div className="container">
            {news?.name ? (
                <div className="mt-3 border rounded p-3 shadow bg-light">
                    <h3 className="text-center mb-5 fs-2">
                        Chương trình: {news?.name}
                    </h3>
                    <p>
                        <span className="fw-bold fs-5">Thời gian: </span>
                        {news?.date}
                    </p>
                    <p>
                        <span className="fw-bold fs-5">Địa điểm: </span>
                        {news?.location}
                    </p>
                    <p>
                        <span className="fw-bold fs-5">
                            Số lượng sinh viên tối đa:{' '}
                        </span>
                        {news?.numPeople}
                    </p>
                    <p>
                        <span className="fw-bold fs-5">
                            Tiêu chí xét SV5T:{' '}
                        </span>
                        {news?.target}
                    </p>
                    <p>
                        <span className="fw-bold fs-5">
                            Thông tin chi tiết:{' '}
                        </span>
                        <br />
                        {news.summary}
                    </p>
                    <hr />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => history.goBack()}
                    >
                        Go back
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary ms-3"
                        onClick={handleRegister}
                    >
                        Register activity
                    </button>
                    <AlertLogin show={show} setShow={setShow} />
                </div>
            ) : (
                'Loading'
            )}
        </div>
    );
}
