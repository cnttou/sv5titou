import { lazy } from 'react';
import Profile from '../pages/Profile';
import User from '../pages/User';

const Login = lazy(() => import('../pages/Login'));
// const Profile = lazy(() => import('../pages/Profile'));
const NewDetail = lazy(() => import('../pages/NewDetail'));
const LoginAdmin = lazy(() => import('../pages/LoginAdmin'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const AdminManageUser = lazy(() => import('../pages/AdminManageUser'));
const AdminManageNews = lazy(() => import('../pages/AdminManageNews'));
const ActivityRegistered = lazy(() => import('../pages/ActivityRegistered'));

const routes = [
	{
		path: '/login',
		component: Login,
		exact: true,
		private: false,
	},
	{
		path: '/login-admin',
		component: LoginAdmin,
		exact: true,
		private: false,
	},
	{
		path: '/admin',
		component: AdminManageNews,
		exact: true,
		private: false,
	},
	{
		path: '/admin-manage-user',
		component: AdminManageUser,
		exact: true,
		private: false,
	},
	{
		path: '/profile',
		component: Profile,
		exact: true,
		private: false,
	},
	{
		path: '/news',
		component: User,
		exact: true,
		private: false,
	},
	{
		path: '/news/:id',
		component: NewDetail,
		exact: false,
		private: false,
	},
	{
		path: '/register-activity',
		component: ActivityRegistered,
		exact: true,
		private: false,
	},
	{
		path: '*',
		component: PageNotFound,
		private: false,
	},
];

export default routes;
