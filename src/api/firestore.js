import { message } from 'antd';
import dayjs from 'dayjs';
import { currentUser } from './authentication';
import firebase from './firebase';
import { deleteFolderImageActivityApi } from './firebaseStorage';

const db = firebase.firestore();
const { arrayRemove, arrayUnion, increment } = firebase.firestore.FieldValue;
const { FieldValue } = firebase.firestore;
const { documentId } = firebase.firestore.FieldPath;

const USER = 'register_activity';
const MY_ACTIVITY = 'activities';
const ACTIVITY = 'news';
const USER_REGISTER = 'users';

const serializeDoc = (doc) =>
	doc.exists
		? {
				...doc.data(),
				id: doc.id,
		  }
		: {};

const serializeQuery = (querySnapshot) => {
	console.log('serializeQuery: ', querySnapshot.size);
	const kq = {};
	querySnapshot.forEach((doc) => {
		kq[doc.id] = serializeDoc(doc);
	});
	return kq;
};
const catchErr = (err) => {
	message.error('Lỗi vui lòng tải lại trang và thử lại');
	console.error('ERROR: ', err.message);
};

export class UserApi {
	static get() {
		const uid = currentUser().uid;
		return db
			.doc(`${USER}/${uid}`)
			.get()
			.then(serializeDoc)
			.catch(catchErr);
	}
	static setOrUpdate(user = {}) {
		const uid = currentUser().uid;
		return db
			.doc(`${USER}/${uid}`)
			.set(user, { merge: true })
			.then(() => user)
			.catch(catchErr);
	}
	static initMyActivity(id = '', proof = 0, imageAdd, restData) {
		const uid = currentUser().uid;
		const dataUpdate = {
			id,
			confirm: false,
			images: {},
			proof,
		};
		if (imageAdd) dataUpdate.images[imageAdd.name.split('.')[0]] = imageAdd;
		return db
			.doc(`${USER}/${uid}`)
			.update({
				activityId: arrayUnion(id),
				[`activities.${id}`]: dataUpdate,
			})
			.then(() => ({ ...dataUpdate, ...restData }))
			.catch(catchErr);
	}
	static updateProof(id, proof, imageAdd) {
		let uid = currentUser().uid;
		const dataUpdata = {
			[`activities.${id}.confirm`]: false,
			[`activities.${id}.proof`]: increment(proof),
		};
		if (imageAdd)
			dataUpdata[
				`activities.${id}.images.${imageAdd.name.split('.')[0]}`
			] = imageAdd;
		return db
			.doc(`${USER}/${uid}`)
			.update(dataUpdata)
			.then(() => {
				return { proof, id, imageAdd };
			})
			.catch(catchErr);
	}
	static deleteImageProof(id, imageId) {
		let uid = currentUser().uid;
		const dataUpdata = {
			[`activities.${id}.confirm`]: false,
			[`activities.${id}.proof`]: increment(-1),
			[`activities.${id}.images.${imageId}`]: FieldValue.delete(),
		};

		return db
			.doc(`${USER}/${uid}`)
			.update(dataUpdata)
			.then(() => {
				return { id, imageId };
			})
			.catch(catchErr);
	}
	static deleteRegisterActivity(acId) {
		const uid = currentUser().uid;
		return db
			.doc(`${USER}/${uid}`)
			.update({
				[`activities.${acId}`]: FieldValue.delete(),
				activityId: arrayRemove(acId),
			})
			.then(() => acId)
			.catch(catchErr);
	}
}

export class ActivityApi {
	static getRegister() {
		return db
			.collection(ACTIVITY)
			.where('active', '==', true)
			.where('typeActivity', '==', 'register')
			.get()
			.then(serializeQuery)
			.catch(catchErr);
	}
	static getActivityByListId(listId) {
		return db
			.collection(ACTIVITY)
			.where('active', '==', true)
			.where(documentId(), 'in', listId)
			.get()
			.then(serializeQuery)
			.catch(catchErr);
	}
	static getDetailActivityApi(docId = '') {
		return db
			.collection(ACTIVITY)
			.doc(docId)
			.get()
			.then((doc) => {
				let data = {
					...doc.data(),
					id: doc.id,
				};
				return data;
			})
			.catch(catchErr);
	}
	static getOther() {
		return db
			.collection(ACTIVITY)
			.where('active', '==', true)
			.where('typeActivity', 'in', ['require', 'other'])
			.get()
			.then((querySnapshot) => {
				let data = {};
				querySnapshot.forEach((doc) => {
					data[doc.id] = { id: doc.id, ...doc.data() };
				});
				return data;
			})
			.catch(catchErr);
	}

	static editProofActivityApi(acId, number) {
		let uid = currentUser().uid;
		db.collection(ACTIVITY)
			.doc(acId)
			.collection(USER_REGISTER)
			.doc(uid)
			.update({
				confirm: false,
				proof: increment(number),
			});
		return db
			.collection(USER)
			.doc(uid)
			.collection(MY_ACTIVITY)
			.doc(acId)
			.update({
				confirm: false,
				proof: increment(number),
			})
			.then(() => {
				return { number, acId };
			})
			.catch(catchErr);
	}
}

export const getImageSlideShowApi = () => {
	return db
		.collection('slide_show')
		.where('deadline', '>=', dayjs().unix())
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
		})
		.catch(catchErr);
};