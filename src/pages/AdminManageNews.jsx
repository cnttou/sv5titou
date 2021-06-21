import { useEffect, useState } from 'react';
import NewsRowTable from '../components/NewsRowTable';
import ModelNews from '../components/ModelNews';
import { useSelector, useDispatch } from 'react-redux';
import { deleteNewsThunk, fetchNewsThunk } from '../store/reducers/NewsSlide';
import SortItem from '../components/SortNewsItem';
import Loading from '../components/Loading';

export default function AdminManageNews() {
    const listNews = useSelector((state) => state.news.value);
    const dispatch = useDispatch();
    const [newsEdit, setNewsEdit] = useState({});

    useEffect(() => {
        if (listNews.length === 0) {
            dispatch(fetchNewsThunk(10));
        }
    }, []);

    const handleEdit = (index) => {
        setNewsEdit(listNews[index]);
    };

    const handleDelete = (index) => {
        dispatch(deleteNewsThunk(listNews[index].id));
    };
    const buttons = [
        {
            handle: handleEdit,
            type: 'button',
            value: 'Edit',
            className: 'btn btn-success',
        },
        {
            handle: handleDelete,
            type: 'button',
            value: 'Delete',
            className: 'btn btn-danger',
        },
    ];
    const loadTable = (listNews = []) => (
        <table className="table table-bordered table-hover mt-3">
            <thead>
                <tr className="bg-info">
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
                        buttons={buttons}
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
        <div>
            <SortItem />
            {listNews?.length ? loadTable(listNews) : <Loading />}
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
