import { lazy } from 'react';

const User = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Profile = lazy(() => import('../pages/Profile'));
const NewDetail = lazy(() => import('../pages/NewDetail'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const ActivityRegistered = lazy(() => import('../pages/ActivityRegistered'));

const routes = [
	{
		path: '/login',
		component: Login,
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
