import { message } from 'antd';
import dayjs from 'dayjs';
import { currentUser } from './authentication';
import firebase from './firebase';
import { deleteFolderImageActivityApi } from './firebaseStorage';
import { uid as genId } from 'uid';

const db = firebase.firestore();
const { arrayRemove, arrayUnion, increment } = firebase.firestore.FieldValue;
const { FieldValue } = firebase.firestore;
const { documentId } = firebase.firestore.FieldPath;

const USER = 'user';
const MY_ACTIVITY = 'activities';
const ACTIVITY = 'news';
const USER_ACTIVITY = 'user_activity';

export const serializeDoc = (doc) =>
	doc.exists
		? {
				...doc.data(),
				id: doc.id,
		  }
		: {};

export const serializeToArray = (querySnapshot) => {
	const kq = [];
	querySnapshot.forEach((doc) => {
		kq.push({
			id: doc.id,
			...doc.data(),
		});
		kq[doc.id] = serializeDoc(doc);
	});
	return kq;
};
export const serializeToObject = (querySnapshot) => {
	const kq = {};
	querySnapshot.forEach((doc) => {
		kq[doc.id] = serializeDoc(doc);
	});
	return kq;
};

const catchErr = (err, mess = '') => {
	message.error('Vui lòng tải lại trang và thử lại');
	console.error(`ERROR: ${mess}`, err.message);
};
export const getActivities = () =>
	db
		.collection(ACTIVITY)
		.where('active', '==', true)
		.where('typeActivity', '==', 'register')
		.get();

export class UserApi {
	static get() {
		const uid = currentUser().uid;
		return db
			.doc(`${USER}/${uid}`)
			.get()
			.then(serializeDoc)
			.catch((err) => catchErr(err, 'UserApi.get'));
	}
	static setOrUpdate(user = {}) {
		const uid = currentUser().uid;
		return db
			.doc(`${USER}/${uid}`)
			.set(user, { merge: true })
			.then(() => user)
			.catch((err) => catchErr(err, 'UserApi.setOrUpdate'));
	}
	static initMyActivity(acId, imageAdd) {
		const uid = currentUser().uid;
		const id = genId(20);
		const dataUpdate = {
			acId,
			uid,
			confirm: false,
			createAt: new Date().getTime(),
			proof: {},
		};
		if (imageAdd) dataUpdate.proof[imageAdd.name] = imageAdd;
		return db
			.doc(`${USER_ACTIVITY}/${id}`)
			.set(dataUpdate)
			.then(() => ({ ...dataUpdate, id }))
			.catch((err) => catchErr(err, 'UserApi.initMyActivity'));
	}
	static updateProof(id, proof, acId) {
		const dataUpdate = { confirm: false, proof };
		return db
			.doc(`${USER_ACTIVITY}/${id}`)
			.update(dataUpdate)
			.then(() => ({ proof, id, acId }))
			.catch((err) => catchErr(err, 'UserApi.updateProof'));
	}
	static deleteImageProof(id, imageId, acId) {
		const dataUpdata = {
			[`proof.${imageId}`]: FieldValue.delete(),
		};

		return db
			.doc(`${USER_ACTIVITY}/${id}`)
			.update(dataUpdata)
			.then(() => {
				return { id, imageId, acId };
			})
			.catch((err) => catchErr(err, 'UserApi.deleteImageProof'));
	}
	static deleteRegisterActivity(id, acId) {
		return db
			.doc(`${USER_ACTIVITY}/${id}`)
			.delete()
			.then(() => ({ acId, id }))
			.catch((err) => catchErr(err, 'UserApi.deleteRegisterActivity'));
	}
}

export class ActivityApi {
	static getRegister() {
		return db
			.collection(ACTIVITY)
			.where('active', '==', true)
			.get()
			.then(serializeToObject)
			.catch((err) => catchErr(err, 'AcitivityApi.getRegister'));
	}
	static getMyActivity() {
		const uid = currentUser().uid;
		return db
			.collection(USER_ACTIVITY)
			.where('uid', '==', uid)
			.get()
			.then((querySnapshot) => {
				const kq = {};
				querySnapshot.forEach((doc) => {
					kq[doc.data().acId] = serializeDoc(doc);
				});
				return kq;
			})
			.catch((err) => catchErr(err, 'AcitivityApi.getOther'));
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
		.catch((err) => catchErr(err, 'getImageSlideShowApi'));
};
