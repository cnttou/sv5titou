import { useEffect, useState } from 'react';
import NewsRowTable from '../components/NewsRowTable';
import ModelNews from '../components/ModelNews';
import { deleteData } from '../api/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNews } from '../store/reducers/NewsSlide';

export default function AdminManageNews({ toast }) {
    const listNews = useSelector((state) => state.news.value);
    const dispatch = useDispatch();
    const [newsEdit, setNewsEdit] = useState({});
    
    useEffect(() => {
        if (listNews.length == 0) {
            dispatch(fetchNews(10));
        }
    }, []);
    
    const handleEdit = (index) => {
        setNewsEdit(listNews[index]);
    };
    
    const handleDelete = (index) => {
        deleteData('news', listNews[index].id).then(() => {
            toast('Xóa thành công tin tức');
        });
    };
    return (
        <div>
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
                    {listNews.map((c, i) => (
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
            <ModelNews item={newsEdit} toast={toast} setItem={setNewsEdit} />
        </div>
    );
}
