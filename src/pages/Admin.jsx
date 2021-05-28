import { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import AdminManageNews from './AdminManageNews';
import AdminManageUser from './AdminManageUser';
import { toast } from 'react-toastify';

export default function Admin() {
    const [page, setPage] = useState(0);
    return (
        <div className="app">
            <div className="container h-100">
                <div className="row header">
                    <HeaderAdmin setPage={setPage} page={page} />
                </div>
                <div className="row">
                    {page === 0 ? (
                        <AdminManageNews toast={toast} />
                    ) : (
                        <AdminManageUser />
                    )}
                </div>
            </div>
        </div>
    );
}
