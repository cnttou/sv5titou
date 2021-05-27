import firebase from '../api/firebase';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

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
                history.push('/admin');
            })
            .catch((error) => {
                var errorMessage = error.message;
                toast('Thông tin đăng nhấp sai');
                console.log(errorMessage);
            });
    };
    return (
        <div>
            <ToastContainer />
            <div className="container">
                <h2>LOGIN</h2>
                <form>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                        >
                            Email address
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your email"
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
                            className="form-label"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => handleLogin(e)}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
