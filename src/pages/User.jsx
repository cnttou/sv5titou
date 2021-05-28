import { useEffect, useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { logout } from '../api/authentication';
import { getData } from '../api/firestore';
import NewsRowTable from '../components/NewsRowTable';

export default function User() {
    const [listNews, setListNews] = useState([]);
    let history = useHistory();
    const handleLogout = () => {
        logout(history);
    };
    useEffect(() => {
        if (listNews.length == 0)
            getData('news', 10).then((data) => {
                setListNews(data);
            });
    }, []);
    return (
        <>
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <NavLink
                            className="navbar-brand"
                            to="/"
                            activeClassName="active"
                        >
                            <img
                                src="../../public/logo.png"
                                alt="Logo image"
                                width="30"
                                height="30"
                                className="d-inline-block align-text-top"
                            />
                            SV5T
                        </NavLink>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div
                            className="collapse navbar-collapse"
                            id="navbarNav"
                        >
                            <ul className="navbar-nav container-fluid">
                                <li className="nav-item">
                                    <Link
                                        className="nav-link active"
                                        aria-current="page"
                                        to="/"
                                    >
                                        News
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className="nav-link"
                                        activeClassName="active"
                                        to="/register-activity"
                                    >
                                        Register activity
                                    </NavLink>
                                </li>
                            </ul>
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
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
                        {listNews.map((c, i) => (
                            <NewsRowTable {...c} index={i} key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
