import 'antd/dist/antd.css';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import pages from './routes/Routes';
import PrivateRoute from './routes/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';
import Loading from './components/Loading';
import { useEffect } from 'react';
import { auth, currentUser } from './api/authentication';
import { useDispatch } from 'react-redux';
import { loginAction } from './store/actions';
import { nameMajors } from './pages/Login';
import { useSelector } from 'react-redux';
import HeaderUser from './components/HeaderUser';
import FooterContent from './components/FooterContent';

function App() {
	const dispatch = useDispatch();
	const currentUser = useSelector((s) => s.user.value);

	auth().onAuthStateChanged((user) => {
		if (user && user.uid !== currentUser.uid) {
			const usr = {
				email: user.email,
				photoURL: user.photoURL,
				displayName: user.displayName,
				uid: user.uid,
				phoneNumber: user.phoneNumber,
			};
			let studentCode = usr.email.slice(0, 10);
			let majorsCode = usr.email.slice(3, 6);

			dispatch(
				loginAction({
					...usr,
					studentCode,
					majors: nameMajors[majorsCode],
				})
			);
		}
	});

	const showPage = (pages) => {
		var result = null;
		if (pages.length > 0) {
			result = pages.map((page, i) =>
				page?.private ? (
					<PrivateRoute key={i} {...page} />
				) : (
					<Route key={i} {...page} />
				)
			);
		}
		return result;
	};
	return (
		<>
			<Router>
				<ToastContainer autoClose={1000} hideProgressBar />
				<Suspense fallback={<Loading />}>
					<HeaderUser />
					<Switch>
						<Redirect from="/" to="/news" exact />
						{showPage(pages)}
					</Switch>
					<FooterContent />
				</Suspense>
			</Router>
		</>
	);
}

export default App;
