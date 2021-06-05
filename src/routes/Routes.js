import { lazy } from 'react';
import UserLayout from '../layouts/UserLayout';

const Admin = lazy(() => import('../pages/Admin'));
const User = lazy(() => import('../pages/User'));
const Login = lazy(() => import('../pages/Login'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const NewsDetail = lazy(() => import('../pages/NewsDetail'));
const ManageActivityRegister = lazy(() =>
    import('../pages/ManageActivityRegister')
);

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
        path: '/news',
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
