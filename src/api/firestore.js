import { toast } from 'react-toastify';
import firebase from './firebase';

const db = firebase.firestore();

export const getRegisterActivity = () => {
    let uId = firebase.auth().currentUser.uid;
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
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
            return acId;
        })
        .catch(() => {
            toast('Hủy đăng kí thất bại, vui lòng thử lại.');
        });
};
export const registerActivity = (acId, name, date, location) => {
    let uId = firebase.auth().currentUser.uid;
    let data = { confirm: false, proof: false, name, date, location };
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
        .doc(acId)
        .set(data)
        .then(() => {
            toast('Đăng kí thành công.');
            return {...data, id: acId}
        })
        .catch((e) => {
            console.log(e);
            toast('Đăng kí không thành công, vui lòng thử lại.');
        });
};

export const getDocument = (collection = 'news', docId = '') => {
    return db
        .collection(collection)
        .doc(docId)
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
/**
 * 
 * @param {String} collection the collection of database
 * @param {String} docId the id for this document
 * @returns if it done return docId deleted
 */
export const deleteData = (collection = 'news', docId) => {
    return db
        .collection(collection)
        .doc(docId)
        .delete()
        .then(() => {
            toast('Xóa thành công tin tức');
            return docId;
        })
        .catch((error) => {
            toast('Xóa thất bại vui lòng thử lại.');
            console.log(error);
        });
};
export const addData = (collection = 'news', data, docId = '') => {
    if (docId === '')
        return db
            .collection(collection)
            .add(data)
            .then((doc) => {
                toast('Thêm thành công');
                return { ...data, id: doc.id };
            })
            .catch((err) => {
                toast('Thêm thất bại vui lòng thử lại');
                console.log(err);
            });
    else
        return db
            .collection(collection)
            .doc(docId)
            .set(data)
            .then(() => {
                toast('Thêm thành công');
                return { ...data, id: docId };
            })
            .catch((err) => {
                toast('Thêm thất bại vui lòng thử lại');
                console.log(err);
            });
};
export const updateData = (collection = 'news', data, docId = '') => {
    return db.collection(collection).doc(docId).update(data);
};
