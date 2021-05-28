import Admin from '../pages/Admin';
import User from '../pages/User';
import Login from '../pages/Login';
import PageNotFound from '../pages/PageNotFound';
import NewsDetail from '../pages/NewsDetail';

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
        private: false,
    },
    {
        path: '/:id',
        component: NewsDetail,
        private: false,
    },
    {
        path: '*',
        component: PageNotFound,
        private: false,
    },
];

export default routes;