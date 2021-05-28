import firebase from '../api/firebase';
import { Route, Redirect } from 'react-router-dom';
function PrivateRoute({ ...rest }) {
    let auth = firebase.auth().currentUser;
    return auth?.email ? (
        <Route {...rest} />
    ) : (
        <Redirect
            to={{
                pathname: '/login',
                state: { from: rest.path },
            }}
        />
    );
}

export default PrivateRoute;