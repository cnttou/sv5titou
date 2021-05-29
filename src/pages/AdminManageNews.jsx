import { useEffect, useState } from 'react';
import NewsRowTable from '../components/NewsRowTable';
import ModelNews from '../components/ModelNews';
import { useSelector, useDispatch } from 'react-redux';
import { deleteNewsThunk, fetchNewsThunk } from '../store/reducers/NewsSlide';

export default function AdminManageNews() {
    const listNews = useSelector((state) => state.news.value);
    const dispatch = useDispatch();
    const [newsEdit, setNewsEdit] = useState({});

    useEffect(() => {
        if (listNews.length == 0) {
            dispatch(fetchNewsThunk(10));
        }
    }, []);

    const handleEdit = (index) => {
        setNewsEdit(listNews[index]);
    };

    const handleDelete = (index) => {
        dispatch(deleteNewsThunk(listNews[index].id));
    };
    const handleRefresh = () => {
        dispatch(fetchNewsThunk(10));
    };
    return (
        <div>
            <div>
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleRefresh}
                >
                    Làm mới
                </button>
            </div>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Tên</th>
                        <th scope="col">Tiêu chí</th>
                        <th scope="col">Thời gian</th>
                        <th scope="col">Địa điểm</th>
                        <th scope="col">Số người</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listNews?.length &&
                        listNews.map((c, i) => (
                            <NewsRowTable
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                {...c}
                                index={i}
                                key={i}
                            />
                        ))}
                </tbody>
            </table>
            <div className="d-grid">
                <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                >
                    Add new item
                </button>
            </div>
            <ModelNews item={newsEdit} setItem={setNewsEdit} />
        </div>
    );
}
