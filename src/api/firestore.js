import dayjs from 'dayjs';
import { currentUser } from './authentication';
import firebase from './firebase';
import { deleteFolderImageActivityApi } from './firebaseStorage';

const db = firebase.firestore();
const { arrayRemove, arrayUnion, increment } = firebase.firestore.FieldValue;
const { documentId } = firebase.firestore.FieldPath;

const genId = (userId, acId) => `${userId}_${acId}`;
const USER = 'register_activity';
const MY_ACTIVITY = 'activities';
const ACTIVITY = 'news';
const USER_REGISTER = 'users';

export const getActivityByListId = (listId) => {
	return db
		.collection(ACTIVITY)
		.where('active', '==', true) //.where('typeActivity', '==', 'register')
		.where(documentId(), 'in', listId)
		.get()
		.then((querySnapshot) => {
			let listData = [];
			querySnapshot.forEach(async (doc) => {
				listData.push({
					...doc.data(),
					id: doc.id,
				});
			});
			return listData;
		});
};
export const getRegisterActivityApi = (userId) => {
	let uId = userId || currentUser().uid;
	return db
		.collection(USER)
		.doc(uId)
		.collection(MY_ACTIVITY)
		.get()
		.then((querySnapshot) => {
			let dataUser = [];
			querySnapshot.forEach((doc) => {
				dataUser.push({
					...doc.data(),
					id: doc.id,
				});
			});
			return dataUser;
		})
		.then((dataUser) => {
			if (dataUser.length)
				return getActivityByListId(dataUser.map((c) => c.id)).then(
					(activities) => {
						return activities.map((c) => ({
							...dataUser.find((d) => d.id === c.id),
							...c,
						}));
					}
				);
			return dataUser;
		})
		.catch((error) => console.log('getRegisterActivityApi', error.message));
};
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
		});
};
export const getDetailActivityApi = (docId = '') => {
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
		.catch((error) => console.log(error.message));
};
export const getOtherActivitiesApi = () => {
	return db
		.collection(ACTIVITY)
		.where('active', '==', true)
		.where('typeActivity', 'in', ['require', 'other'])
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
		.catch((error) => console.log(error.message));
};
export const getActivitiesApi = (limit = 25) => {
	return db
		.collection(ACTIVITY)
		.where('active', '==', true)
		.where('typeActivity', '==', 'register')
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
		})
		.catch((error) => console.log(error.message));
};
export const getUserDetailApi = () => {
	return db
		.collection(USER)
		.doc(currentUser().uid)
		.get()
		.then((res) => ({
			...res.data(),
			uid: res.id,
		}))
		.catch((err) => console.log(err.message));
};
export const registerActivityApi = (dataActivity) => {
	let uId = currentUser().uid;
	let acId = dataActivity.id;

	let data = {
		userId: uId,
		acId,
		confirm: false,
		proof: dataActivity.proof || 0,
		email: currentUser().email,
		displayName: currentUser().displayName,
	};
	db.collection(ACTIVITY).doc(acId).collection(USER_REGISTER).doc(uId).set(data);
	return db
		.collection(USER)
		.doc(uId)
		.collection(MY_ACTIVITY)
		.doc(acId)
		.set(data)
		.then(() => {
			return { ...data, ...dataActivity };
		});
};
export const addUserDetailApi = (data) => {
	const baseInfo = {
		email: currentUser().email,
		displayName: currentUser().displayName,
		userId: currentUser().uid,
	};
	return db
		.collection(USER)
		.doc(currentUser().uid)
		.set(
			{
				...baseInfo,
				...data,
			},
			{ merge: true }
		)
		.then(() => ({ ...data, ...baseInfo }))
		.catch((err) => console.log(err.message));
};
export const editProofActivityApi = (acId, number) => {
	let uId = currentUser().uid;
	db.collection(ACTIVITY)
		.doc(acId)
		.collection(USER_REGISTER)
		.doc(uId)
		.update({
			confirm: false,
			proof: increment(number),
		});
	return db
		.collection(USER)
		.doc(uId)
		.collection(MY_ACTIVITY)
		.doc(acId)
		.update({
			confirm: false,
			proof: increment(number),
		})
		.then(() => {
			return { number, acId };
		});
};
export const cancelConfirmMyActivityApi = (acId) => {
	let uId = currentUser().uid;
	db.collection(ACTIVITY)
		.doc(acId)
		.collection(USER_REGISTER)
		.doc(uId)
		.update({ confirm: false });
	return db
		.collection(USER)
		.doc(uId)
		.collection(MY_ACTIVITY)
		.doc(acId)
		.update({ confirm: false })
		.then(() => {
			return { acId, confirm: false };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const deleteRegisterActivityApi = (acId) => {
	let uId = currentUser().uid;
	// db.collection(USER)
	// 	.doc(uId)
	// 	.update({ activities: arrayRemove(acId) });
	db.collection(ACTIVITY).doc(acId).collection(USER_REGISTER).doc(uId).delete();
	return db
		.collection(USER)
		.doc(uId)
		.collection(MY_ACTIVITY)
		.doc(acId)
		.delete()
		.then(() => acId);
};
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
		});
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
		.catch((error) => {
			console.log('error', error.message);
		});
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
		.catch((error) => {
			console.log('error', error.message);
		});
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
		.catch((error) => console.log('Error', error.message));
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
		.catch((error) => console.log('Error', error.message));
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
		});
};
