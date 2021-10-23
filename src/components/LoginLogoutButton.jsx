import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { currentUser } from '../api/authentication';
import { logoutAction } from '../store/actions';

export default function LoginLogoutButton() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutAction());
    };

    if (currentUser()?.email)
        return (
            <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={handleLogout}
            >
                Logout
            </button>
        );
        
    else
        return (
            <Link
                type="button"
                className="btn btn-outline-primary w-100"
                to={'/login'}
            >
                Login
            </Link>
        );
}
