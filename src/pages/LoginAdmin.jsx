import { message } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginWithEmailPasswordApi } from '../api/authentication';

export default function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    let history = useHistory();

    const handleLogin = (e) => {
        e.preventDefault();
        loginWithEmailPasswordApi(email, password)
			.then(() => {
				history.push('/admin');
			})
			.catch((error) => {
				message.warning('Thông tin đăng nhập không đúng!');
				console.log(error.errorMessage);
			});;
    };
    
    const handleEmailInput = ({ target }) => setEmail(target.value);
    
    const handlePasswordInput = ({ target }) => setPassword(target.value);
    
    return (
        <div>
            <div className="container-md AdminLogin">
                <h2 className="text-center">ĐĂNG NHẬP</h2>
                <hr />
                <form>
                    <div className="mb-3">
                        <label htmlFor="email1" className="form-label require">
                            Email
                        </label>
                        <input
                            type="text"
                            placeholder="1234567890abc@ou.edu.vn"
                            value={email}
                            onChange={handleEmailInput}
                            className="form-control"
                            id="email1"
                            aria-describedby="emailHelp"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pass" className="form-label require">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password..."
                            value={password}
                            onChange={handlePasswordInput}
                            className="form-control"
                            id="pass"
                        />
                    </div>
                    <hr />
                    <button
                        type="submit"
                        className="btn btn-primary form-control"
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
