import { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import AdminManageNews from './AdminManageNews';
import AdminManageUser from './AdminManageUser';

export default function Admin() {
    const [page, setPage] = useState(0);

    const showContainer = () => {
        if (page === 0) return <AdminManageNews />;
        else return <AdminManageUser />;
    };

    const handlePage = (page) => {
        setPage(page);
    };

    return (
        <div className="app">
            <div className="container-xl h-100">
                <div className="row">
                    <HeaderAdmin setPage={handlePage} page={page} />
                </div>
                <div className="row">{showContainer()}</div>
            </div>
        </div>
    );
}
