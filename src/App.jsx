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
	addUserDetailAction,
	fetchActivityAction,
	fetchRegisteredActivityAction,
	getUserDetailAction,
} from './store/actions';
import HeaderUser from './components/HeaderUser';
import { lazy } from 'react';
const FooterContent = lazy(() => import('./components/FooterContent'));
import './App.css';
import {
	addMoreMyActivityAction,
	syncMoreMyActivityAction,
} from './store/reducers/myActivitySlice';
import { getOtherActivitiesApi, testAddDataApi, testDeteleProofApi, testUpdateDataApi, testUpdateProofApi } from './api/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

function App() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const currentUser = useSelector((s) => s.user.value);

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged((user) => {
			if (user && loading) {
				// testDeteleProofApi();
				setLoading(false);
				dispatch(getUserDetailAction()).then((action) => {
					setLoading(true);
					const user = action.payload;
					if (!user.email) dispatch(addUserDetailAction({}));

					dispatch(fetchRegisteredActivityAction(user.uid)).then(
						(action) => {
							let listId = action.payload.map((c) => c.id);
							getOtherActivitiesApi().then((data) => {
								const addData = data.filter(
									(d) => listId.includes(d.id) === false
								);
								dispatch(addMoreMyActivityAction(addData));
							});
						}
					);
				});
			}
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
        console.log('run on auth');
		dispatch(fetchActivityAction(100)).then((action) => {
			dispatch(syncMoreMyActivityAction(action.payload));
		});
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
