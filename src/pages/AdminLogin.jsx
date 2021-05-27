import firebase from '../api/firebase';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-bootstrap';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();
    const handleLogin = (e) => {
        e.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                history.push('/');
            })
            .catch((error) => {
                var errorMessage = error.message;
                toast('Thông tin đăng nhập không đúng');
                console.log(errorMessage);
            });
    };
    return (
        <div>
            <ToastContainer />
            <div className="container AdminLogin">
                <h2 className="text-center">ĐĂNG NHẬP</h2>
                <hr />
                <form>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputEmail1"
                            className="form-label require"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            placeholder="1234567890abc@ou.edu.vn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputPassword1"
                            className="form-label require"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                        />
                    </div>
                    <hr />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => handleLogin(e)}
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
