import { toast } from 'react-toastify';
import { currentUser } from './authentication';
import firebase from './firebase';

const db = firebase.firestore();

export const addImage = (fileName, acId = '') => {
	let uId = firebase.auth().currentUser.uid;
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
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
		.collection('activities')
		.doc(acId)
		.update({
			images: firebase.firestore.FieldValue.arrayRemove(fileName),
		});
};

export const getRegisterActivityApi = (userId) => {
	let uId = userId || currentUser().uid;
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.get()
		.then((querySnapshot) => {
			let data = [];
			querySnapshot.forEach(async (doc) => {
				data.push({
					...doc.data(),
					id: doc.id,
				});
			});
			return data;
		})
		.catch((error) => console.log(error.message));
};
export const updateConfirmActivity = (acId, proof) => {
	let uId = firebase.auth().currentUser.uid;
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.update({
			proof,
		})
		.then(() => {
			toast.success('Cập nhật thành công.');
		})
		.catch(() => {
			toast.warn('Cập nhật thất bại, vui lòng thử lại.');
		});
};
export const removeRegisterActivity = (acId) => {
	let uId = firebase.auth().currentUser.uid;
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.delete()
		.then(() => acId);
};
export const registerActivityApi = (dataActivity) => {
	let uId = currentUser().uid;
	let acId = dataActivity.id;

	let data = {
		confirm: false,
		proof: false,
		...dataActivity,
	};
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.set(data)
		.then((res) => {
			console.log('res of register: ', res);
			return data;
		});
};

export const getDetailActivityApi = (docId = '') => {
	return db
		.collection('news')
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
export const getActivitiesApi = (limit = 25) => {
	return db
		.collection('news')
		.orderBy('date', 'desc')
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
export const deleteData = (collection, docId) => {
	return db
		.collection(collection || 'news')
		.doc(docId)
		.delete()
		.then(() => docId);
};
export const addData = (collection = 'news', data, docId) => {
	if (docId === null) {
		return db
        .collection(collection)
        .add(data)
        .then((doc) => ({ ...data, id: doc.id }));
	} else{
		return db
			.collection(collection)
			.doc(docId)
			.set(data)
			.then(() => ({ ...data, id: docId }));
    }
};
export const updateData = (collection = 'news', data, docId = '') => {
	return db.collection(collection).doc(docId).update(data);
};
export const addUserDetail = (data) => {
    console.log('data add :', {
		email: currentUser().email,
		userId: currentUser().uid,
		...data,
	});
	return db.collection('register_activity')
		.doc(currentUser().uid)
		.set(
			{
				email: currentUser().email,
				userId: currentUser().uid,
                ...data
			},
			{ merge: true }
		).then(()=>({...data})).catch((err)=>console.log(err.message))
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
		.then((rs) => {
			return Promise.all(
				rs.map((c) => getRegisterActivityApi(c.userId))
			).then((res) => {
				return rs.map((c, index) => ({ ...c, listData: res[index] }));
			});
		});
};
export const confirmProof = (uid, acId) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.collection('activities')
		.doc(acId)
		.update({ confirm: true })
		.then(() => {
			return { uid, acId, confirm: true };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const cancelConfirmProof = (uid, acId, confirm) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.collection('activities')
		.doc(acId)
		.update({ confirm })
		.then(() => {
			return { uid, acId, confirm: false };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const cancelConfirmMyProofApi = ( acId ) => {
    let uid = currentUser().uid
	return db
		.collection('register_activity')
		.doc(uid)
		.collection('activities')
		.doc(acId)
		.update({ confirm: false })
		.then(() => {
			return { acId, confirm: false };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
