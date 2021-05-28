import Admin from '../pages/Admin';
import User from '../pages/User';
import Login from '../pages/Login';
import PageNotFound from '../pages/PageNotFound';

const routes = [
    {
        path: '/login',
        component: Login,
        exact: true,
        private: false,
    },
    {
        path: '/admin',
        component: Admin,
        exact: true,
        private: true,
    },
    {
        path: '/',
        component: User,
        exact: true,
        private: true,
    },
    {
        path: '*',
        component: PageNotFound,
        private: false,
    },
];

export default routes;