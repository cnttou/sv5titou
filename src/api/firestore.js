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
    message.error('Lỗi vui lòng tải lại trang và thử lại')
    console.error('ERROR: ', err.message)
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
				activitiyId: arrayUnion(id),
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
			}).catch(catchErr);
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
				activitiyId: arrayRemove(acId),
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

// test API
export const cleanCode = () => {
	return db
		.collection(ACTIVITY)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				deleteRegisterActivityApi(doc.id).then(() =>
					console.log('success clean')
				);
				deleteFolderImageActivityApi(doc.id).then(() =>
					console.log('success clean')
				);
			});
		})
		.catch(catchErr);
};
export const testUpdateProofApi = () => {
	const uid = currentUser().uid;
	return db
		.collection('register_activity')
		.doc(uid)
		.update({
			'activities.ECxaXf0GA7SxyThq6vLv.proof': increment(1),
			'activities.ECxaXf0GA7SxyThq6vLv.confirm': false,
		})
		.then(() => {
			console.log('Success update proof');
		})
		.catch(catchErr);
};
export const testDeteleProofApi = () => {
	const uid = currentUser().uid;
	return db
		.collection('register_activity')
		.doc(uid)
		.update({
			'activities.ECxaXf0GA7SxyThq6vLv':
				firebase.firestore.FieldValue.delete(),
			activitiyId: arrayRemove('ECxaXf0GA7SxyThq6vLv'),
		})
		.then(() => {
			console.log('Success delete activity');
		})
		.catch(catchErr);
};

export const testAddDataApi = () => {
	const uid = currentUser().uid;
	return db
		.collection('register_activity')
		.doc(uid)
		.set(
			{
				activitiyId: ['27e08800782150cc8503', 'ECxaXf0GA7SxyThq6vLv'],
				activities: {
					'27e08800782150cc8503': {
						id: '27e08800782150cc8503',
						confirm: false,
						proof: 1,
					},
					ECxaXf0GA7SxyThq6vLv: {
						id: 'ECxaXf0GA7SxyThq6vLv',
						confirm: true,
						proof: 1,
					},
				},
			},
			{ merge: true }
		)
		.then(() => {
			console.log('Success add');
		})
		.catch(catchErr);
};
export const testUpdateDataApi = () => {
	const uid = currentUser().uid;
	return db
		.collection('register_activity')
		.doc(uid)
		.update({
			activitiyId: arrayUnion('ECxaXf0GA7SxyThq6vLv'),
			'activities.ECxaXf0GA7SxyThq6vLv': {
				id: 'ECxaXf0GA7SxyThq6vLv',
				confirm: true,
				proof: 1,
			},
		})
		.then(() => {
			console.log('Success update');
		})
		.catch(catchErr);
};
export const testApi = () => {
	const uid = currentUser().uid;
	return db
		.collection('register_activity')
		.where(
			'activities.27e08800782150cc8503.id',
			'==',
			'27e08800782150cc8503'
		)
		.get()
		.then((querySnapshot) => {
			const kq = {};
			querySnapshot.forEach((doc) => {
				kq[doc.id] = doc.data();
			});
			console.log('query test api', kq);
		})
		.catch(catchErr);
};
