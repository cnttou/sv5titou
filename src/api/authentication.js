import { toast } from 'react-toastify';
import firebase from './firebase';
import { addUserDetail } from './firestore';

export const checkLogin = () => {
    if (firebase.auth()?.currentUser?.email) return true;
    else return false;
};

export const auth = () => firebase.auth();

export const currentUser = () => firebase.auth()?.currentUser;

export const logoutApi = () => {
    return firebase
        .auth()
        .signOut()
};

export const loginByGoogle = async () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        login_hint: '1234567890abc@ou.edu.vn',
    });

    return firebase.auth().signInWithPopup(provider);
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
