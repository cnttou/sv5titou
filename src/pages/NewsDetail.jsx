import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { checkLogin } from '../api/authentication';
import { getDocument, registerActivity } from '../api/firestore';
import AlertLogin from '../components/AlertLogin';

export default function NewsDetail() {
    let { id } = useParams();
    const [news, setNews] = useState({});
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (id !== '') {
            getDocument('news', id).then((data) => setNews(data));
        }
    }, [id]);
    const handleRegister = async () => {
        if (await checkLogin()) registerActivity(id);
        else setShow(true);
    };
    return (
        <div className="container">
            {news?.name ? (
                <div>
                    <h3>Chương trình: {news?.name}</h3>
                    <h5>Thời gian: {news?.date}</h5>
                    <h5>Địa điểm: {news?.location}</h5>
                    <p>Số lượng sinh viên tối đa: {news?.numPeople}</p>
                    <p>Tiêu chí xét SV5T: {news?.target}</p>
                    <p>
                        Thông tin chi tiết: <br />
                        {news.summary}
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
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
