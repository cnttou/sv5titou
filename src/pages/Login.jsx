import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { loginByGoogle, loginWithEmailPassword } from '../api/authentication';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();
    let location = useLocation();
    const handleLogin = (e) => {
        e.preventDefault();
        loginWithEmailPassword(history, location, email, password);
    };

    const handleLoginWithGmail = (e) => {
        loginByGoogle(history);
    };

    return (
        <div>
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
                        className="btn btn-primary form-control"
                        onClick={(e) => handleLogin(e)}
                    >
                        Đăng nhập
                    </button>
                    <p className="text-center pt-1 m-0">--- hoặc ---</p>

                    <button
                        type="button"
                        className="btn btn-danger form-control"
                        onClick={(e) => handleLoginWithGmail(e)}
                    >
                        <i className="fab fa-google-plus-g"></i> | Đăng nhập
                        bằng Gmail
                    </button>
                </form>
            </div>
        </div>
    );
}
