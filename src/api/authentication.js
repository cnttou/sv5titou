import { toast } from 'react-toastify';
import { logoutAction } from '../store/reducers/action';
import firebase from './firebase';

export const checkLogin = () => {
    if (firebase.auth()?.currentUser?.email) return true;
    else return false;
};
export const currentUser = () => firebase.auth()?.currentUser;

export const logout = (history, dispath) => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            dispath(logoutAction());
            history.push('/login');
        })
        .catch((error) => {
            toast('Hiện tại không đăng xuất được vui lòng thử lại');
            console.log(error);
        });
};

export const loginByGoogle = async (history) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        login_hint: '1234567890abc@ou.edu.vn',
    });

    await firebase.auth().signInWithPopup(provider);
    firebase
        .auth()
        .getRedirectResult()
        .then(() => {
            if (firebase.auth().currentUser.email.slice(-9) === 'ou.edu.vn') {
                history.replace('/');
            } else if (firebase.auth().currentUser.email) {
                toast(
                    'Đăng nhập không thành công. Vui lòng đăng nhập bằng mail trường Đại học Mở'
                );
                firebase.auth().signOut();
            } else toast('Đăng nhập không thành công vui lòng thử lại');
        })
        .catch((error) => {
            console.log(error);
        });
};

export const loginWithEmailPassword = (history, location, email, password) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            let { from } = location.state || { from: { pathname: '/admin' } };
            history.replace(from);
        })
        .catch((error) => {
            var errorMessage = error.message;
            toast('Thông tin đăng nhập không đúng');
            console.log(errorMessage);
        });
};
