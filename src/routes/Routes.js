import { lazy } from 'react';
import UserLayout from '../layouts/UserLayout';

const ActivityRegistered = lazy(() => import('../pages/ActivityRegistered'));
const Profile = lazy(() => import('../pages/Profile'));
const Admin = lazy(() => import('../pages/Admin'));
const User = lazy(() => import('../pages/User'));
const Login = lazy(() => import('../pages/Login'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

const routes = [
	{
		path: '/login',
		component: UserLayout(Login),
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
