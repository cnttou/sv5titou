import { toast } from 'react-toastify';
import firebase from './firebase';

const db = firebase.firestore();
/*
 * Manage News *
 */
export const updateConfirmActivity = (acId, proof) => {
    let uId = firebase.auth().currentUser.uid;
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
        .doc(acId)
        .update({
            proof,
        })
        .then(() => {
            toast('Cập nhật thành công.');
        })
        .catch(() => {
            toast('Cập nhật thất bại, vui lòng thử lại.');
        });
};
export const removeRegisterActivity = (acId) => {
    let uId = firebase.auth().currentUser.uid;
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
        .doc(acId)
        .delete()
        .then(() => {
            toast('Đã hủy đăng kí.');
        })
        .catch(() => {
            toast('Hủy đăng kí thất bại, vui lòng thử lại.');
        });
};
export const registerActivity = (acId) => {
    let uId = firebase.auth().currentUser.uid;
    let data = { confirm: false, proof: false };
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
        .doc(acId)
        .set(data)
        .then(() => {
            toast('Đăng kí thành công.');
        })
        .catch((e) => {
            console.log(e);
            toast('Đăng kí không thành công, vui lòng thử lại.');
        });
};

export const getDocument = (collection = 'news', doc = '') => {
    return db
        .collection(collection)
        .doc(doc)
        .get()
        .then((doc) => {
            let data = {
                ...doc.data(),
                id: doc.id,
            };
            return data;
        });
};
export const getData = (collection = 'news', limit = 10000) => {
    return db
        .collection(collection)
        .limit(limit)
        .get()
        .then((querySnapshot) => {
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    ...doc.data(),
                    id: doc.id,
                });
            });
            return data;
        });
};
export const deleteData = (collection = 'news', doc) => {
    return db.collection(collection).doc(doc).delete();
};
export const addData = (collection = 'news', data, doc = '') => {
    if (doc === '') return db.collection(collection).add(data);
    else return db.collection(collection).doc(doc).set(data);
};
export const updateData = (collection = 'news', data, doc = '') => {
    return db.collection(collection).doc(doc).update(data);
};
