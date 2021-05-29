import { Link, NavLink } from "react-router-dom";
import LoginLogoutButton from "./LoginLogoutButton";

export default function HeaderUser() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <NavLink
                        className="navbar-brand"
                        to="/"
                        activeClassName="active"
                    >
                        <img
                            src="/logo.png"
                            alt="Logo image"
                            width="30"
                            height="30"
                            className="d-inline-block align-text-top"
                        />
                        SV5T
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav container-fluid">
                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/"
                                >
                                    News
                                </Link>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeClassName="active"
                                    to="/register-activity"
                                >
                                    Register activity
                                </NavLink>
                            </li>
                        </ul>
                        <LoginLogoutButton />
                    </div>
                </div>
            </nav>
        </>
    );
}
