import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import pages from './routes/Routes';
import { Suspense } from 'react';
import Loading from './components/Loading';
import { auth } from './api/authentication';
import { useDispatch } from 'react-redux';
import {
	addUserDetailAction,
	getUserDetailAction,
	loginAction,
} from './store/actions';
import { useSelector } from 'react-redux';
import HeaderUser from './components/HeaderUser';
import { lazy } from 'react';
const FooterContent = lazy(() => import('./components/FooterContent'));
import './App.css';
import { useEffect, useState } from 'react';

function App() {
	const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
	const { value: currentUser } = useSelector((s) => s.user);

	useEffect(() => {
		const sub = auth().onAuthStateChanged((user) => {
			if (user && user.uid !== currentUser.uid && loading) {
				setLoading(false)
				dispatch(getUserDetailAction()).then((action) => {
					setLoading(true)
					const user = action.payload;
					if (!user.displayName) dispatch(addUserDetailAction({}));
				});
			}
		});

		return () => {
			return sub;
		};
	}, []);

	const showPage = (pages) => {
		var result = null;
		if (pages.length > 0) {
			result = pages.map((page, i) => <Route key={i} {...page} />);
		}
		return result;
	};
	return (
		<>
			<Router>
				<HeaderUser />
				<Suspense fallback={<Loading />}>
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
