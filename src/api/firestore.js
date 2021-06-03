import { toast } from 'react-toastify';
import firebase from './firebase';

const db = firebase.firestore();

export const addImage = (fileName, acId = '') => {
    let uId = firebase.auth().currentUser.uid;
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
        .doc(acId)
        .update({
            images: firebase.firestore.FieldValue.arrayUnion(fileName),
        });
};
export const deleteImage = (fileName, acId = '') => {
    let uId = firebase.auth().currentUser.uid;
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
        .doc(acId)
        .update({
            images: firebase.firestore.FieldValue.arrayRemove(fileName),
        });
};

export const getRegisterActivity = (userId) => {
    let uId = userId || firebase.auth().currentUser.uid;
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
    let data = {
        confirm: false,
        proof: false,
        name,
        date,
        location,
        images: [],
    };
    return db
        .collection('register_activity')
        .doc(uId)
        .collection('activitis')
        .doc(acId)
        .set(data)
        .then(() => {
            toast('Đăng kí thành công.');
            return { ...data, id: acId };
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
export const addUserDetail = (email, userId) => {
    db.collection('register_activity')
        .doc(userId)
        .set({
            email,
            userId,
        })
        .then(() => {
            console.log('add user detail success');
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getUserActivity = () => {
    return db
        .collection('register_activity')
        .get()
        .then((querySnapshot) => {
            let list = [];
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            });
            return list;
        })
        .then(async (rs) => {
            let list = [];

            for (const c of rs) {
                await getRegisterActivity(c.userId).then((data) => {
                    let temp = data.map((d) => ({
                        ...d,
                        email: c.email,
                        userId: c.userId,
                    }));
                    list = list.concat(temp);
                });
            }

            return list;
        });
};
export const confirmProof = (uid, acId) => {
    return db
        .collection('register_activity')
        .doc(uid)
        .collection('activitis')
        .doc(acId)
        .update({ confirm: true })
        .then(() => {
            toast('Xác nhận thành công.');
            return { uid, acId, confirm: true };
        })
        .catch((e) => {
            console.log(e);
            toast('Xác nhận không thành công, vui lòng thử lại.');
        });
};
export const cancelConfirmProof = (uid, acId) => {
  return db
      .collection('register_activity')
      .doc(uid)
      .collection('activitis')
      .doc(acId)
      .update({ confirm: false })
      .then(() => {
          toast('Hủy xác nhận thành công.');
          return { uid, acId, confirm: false };
      })
      .catch((e) => {
          console.log(e);
          toast('Hủy xác nhận không thành công, vui lòng thử lại.');
      });
};
