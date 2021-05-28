import { useHistory } from 'react-router';
import firebase from '../api/firebase';
import { toast } from 'react-toastify';
import ButtonSwtich from '../components/ButtonSwtich';

const buttonListBar = ['Manage News', 'Manage User'];

export default function HeaderAdmin({ setPage, page }) {
    let history = useHistory();
    const handleLogout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                history.push('/login');
            })
            .catch((error) => {
                toast('Hiện tại không đăng xuất được vui lòng thử lại');
            });
    };
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
                        {firebase.auth().currentUser?.email}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-lg-end">
                        <li>
                            <button className="dropdown-item" type="button">
                                Edit profile
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="btn btn-outline-primary w-100"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
