import { useEffect } from 'react';
import NewsRowTable from '../components/NewsRowTable';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNews } from '../store/reducers/NewsSlide';

function User() {
    const listNews = useSelector((state) => state.news.value);
    const dispatch = useDispatch();

    useEffect(() => {
        if (listNews.length == 0) {
            dispatch(fetchNews(10));
        }
    }, []);
    return (
        <>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Tên</th>
                        <th scope="col">Tiêu chí</th>
                        <th scope="col">Thời gian</th>
                        <th scope="col">Địa điểm</th>
                        <th scope="col">Số người</th>
                    </tr>
                </thead>
                <tbody>
                    {listNews &&
                        listNews.map((c, i) => (
                            <NewsRowTable {...c} index={i} key={i} />
                        ))}
                </tbody>
            </table>
        </>
    );
}

export default User;
