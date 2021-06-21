import { useEffect } from 'react';
import NewsRowTable from '../components/NewsRowTable';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNewsThunk } from '../store/reducers/NewsSlide';
import SortItem from '../components/SortNewsItem';
import Loading from '../components/Loading';
import { fetchRegisterActivityThunk } from '../store/reducers/ActivitySlide';

function User() {
    const listNews = useSelector((state) => state.news.value);
    const listActivity = useSelector((state) => state.activitis.value);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRegisterActivityThunk());
        dispatch(fetchNewsThunk(10));
    }, []);

    const checkRegister = (acId) => {
        if (listActivity.find((c) => c.id === acId))
            return (
                <img src="https://img.icons8.com/color/20/000000/checked--v1.png" />
            );
        else return '';
    };

    const loadTable = (listNews = []) => (
        <table className="table table-news table-bordered table-hover mt-3">
            <thead>
                <tr className="bg-info">
                    <th scope="col">Tên</th>
                    <th scope="col">Tiêu chí</th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Địa điểm</th>
                    <th scope="col">Số người</th>
                </tr>
            </thead>
            <tbody>
                {listNews.map((c, i) => (
                    <NewsRowTable
                        checkRegister={checkRegister}
                        name={c.name}
                        target={c.target}
                        date={c.date}
                        location={c.location}
                        numPeople={c.numPeople}
                        id={c.id}
                        index={i}
                        key={i}
                    />
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            <SortItem />
            {listNews?.length ? loadTable(listNews) : <Loading />}
        </>
    );
}

export default User;
