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
import {
	createOrUpdateUserAction,
	getOtherActivityAction,
	getRegisterActivityAction,
	getUserAction,
} from './store/actions';
import HeaderUser from './components/HeaderUser';
import { lazy } from 'react';
const FooterContent = lazy(() => import('./components/FooterContent'));
import './App.css';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

function App() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(async (user) => {
			if (user && loading) {
                setLoading(false);
                await dispatch(getRegisterActivityAction());
				dispatch(getUserAction()).then((action) => {
					if (!action.payload.email)
                    dispatch(
						createOrUpdateUserAction({
							uid: user.uid,
							displayName: user.displayName,
							email: user.email,
							activities: {},
							activityId: [],
							targetSuccess: [],
						})
					);
					setLoading(true);
				});
				dispatch(getOtherActivityAction());
			} else {
				dispatch(getRegisterActivityAction());
			}
		});

		return unsubscribe;
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
