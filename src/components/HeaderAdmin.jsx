import ButtonSwtich from '../components/ButtonSwtich';
import { currentUser } from '../api/authentication';
import LoginLogoutButton from './LoginLogoutButton';

const buttonListBar = ['Manage News', 'Manage User'];

export default function HeaderAdmin({ setPage, page }) {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                {buttonListBar.map((c, i) => (
                    <ButtonSwtich
                        text={c}
                        handleClick={setPage}
                        active={page === i}
                        id={i}
                        key={i}
                    />
                ))}
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-secondary dropdown-toggle"
                        data-bs-toggle="dropdown"
                        data-bs-display="static"
                        aria-expanded="false"
                    >
                        {currentUser()?.email}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-lg-end">
                        <li>
                            <button className="dropdown-item" type="button">
                                Edit profile
                            </button>
                        </li>
                        <li>
                            <LoginLogoutButton />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
