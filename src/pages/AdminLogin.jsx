import firebase from '../api/firebase';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-bootstrap';

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
                toast('Thông tin đăng nhập không đúng');
                console.log(errorMessage);
            });
    };

    const handleLoginWithGmail = (e) => {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        provider.setCustomParameters({
            'login_hint': '1234567890abc@ou.edu.vn'
        });

        firebase.auth().signInWithRedirect(provider);
        firebase.auth()
        .getRedirectResult()
        .then((result) => {
            if (result.credential) {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // ...
            }
            // The signed-in user info.
            var user = result.user;
            history.push('/user');
        }).catch((error) => {
            console.log(error);
        });
    }

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
                        <i className="fab fa-google-plus-g"></i> | Đăng nhập bằng Gmail
                    </button>
                </form>
            </div>
        </div>
    );
}
