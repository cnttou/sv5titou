import Admin from '../pages/Admin';
import User from '../pages/User';
import Login from '../pages/Login';
import PageNotFound from '../pages/PageNotFound';
import NewsDetail from '../pages/NewsDetail';
import ManageActivityRegister from '../pages/ManageActivityRegister';
import { UserLayout } from '../layouts/UserLayout';

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
        component: UserLayout(User),
        exact: true,
        private: false,
    },
    {
        path: '/register-activity',
        component: UserLayout(ManageActivityRegister),
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