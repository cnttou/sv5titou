import { Route, Redirect } from 'react-router-dom';
import { currentUser } from '../api/authentication';

function PrivateRoute({ ...rest }) {
    let auth = currentUser().uid;
    return auth?.email ? (
        <Route {...rest} />
    ) : (
        <Redirect
            to={{
                pathname: '/login-admin',
                state: { from: rest.path },
            }}
        />
    );
}

export default PrivateRoute;