import ButtonSwtich from '../components/ButtonSwtich';
import { currentUser } from '../api/authentication';
import LoginLogoutButton from './LoginLogoutButton';

const buttonListBar = ['Quản lý hoạt động', 'Quản lý sinh viên'];

export default function HeaderAdmin({ setPage, page }) {
    const renderListBar = () => {
        return buttonListBar.map((c, i) => (
            <ButtonSwtich
                text={c}
                handleClick={setPage}
                active={page === i}
                id={i}
                key={i}
            />
        ));
    };

    return (
        <nav className="navbar navbar-light bg-light">
            {renderListBar()}
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
                            Hồ sơ
                        </button>
                    </li>
                    <li>
                        <LoginLogoutButton />
                    </li>
                </ul>
            </div>
        </nav>
    );
}
