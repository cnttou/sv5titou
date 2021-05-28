import Admin from '../pages/Admin';
import User from '../pages/User';
import AdminLogin from '../pages/AdminLogin';

const routes = [
    {
        path: '/admin/login',
        component: AdminLogin,
        private: false,
    },
    {
        path: '/admin',
        component: Admin,
        private: true,
    },
    {
        path: '/',
        component: User,
        private: true
    },
];

export default routes;