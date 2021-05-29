import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { currentUser, logout } from "../api/authentication";

export default function LoginLogoutButton() {
    let history = useHistory();
    const dispatch = useDispatch();
    const handleLogout = () => {
        logout(history, dispatch);
    };
    return (
        <div>
            {currentUser()?.email ? (
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            ) : (
                <Link
                    type="button"
                    className="btn btn-outline-primary"
                    to={'/login'}
                >
                    Login
                </Link>
            )}
        </div>
    );
}
