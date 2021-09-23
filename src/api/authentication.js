import { toast } from 'react-toastify';
import { logoutAction } from '../store/reducers/action';
import firebase from './firebase';
import { addUserDetail } from './firestore';

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
            toast.warn('Hiện tại không đăng xuất được vui lòng thử lại');
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
                const {email, uid} = firebase.auth().currentUser;
                addUserDetail(email, uid);
                history.replace('/news');
            } else if (firebase.auth().currentUser.email) {
                toast.warn(
                    'Vui lòng đăng nhập email trường cấp!'
                );
                firebase.auth().signOut();
            } else toast.warn('Đăng nhập không thành công vui lòng thử lại!');
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
            const { email, uid } = firebase.auth().currentUser;
            addUserDetail(email, uid);
            let { from } = location.state || { from: { pathname: '/admin' } };
            history.replace(from);
        })
        .catch((error) => {
            var errorMessage = error.message;
            toast.warn('Thông tin đăng nhập không đúng!');
            console.log(errorMessage);
        });
};
