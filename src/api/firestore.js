import { currentUser } from './authentication';
import firebase from './firebase';

const db = firebase.firestore();

export const addUrlImageApi = (fileName, acId = '') => {
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
export const removeUrlImageApi = (fileName, acId = '') => {
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
const getActivityByListId = (listId) => {
	return db
		.collection('news')
		.where('active', '==', true) //.where('typeActivity', '==', 'register')
		.where(firebase.firestore.FieldPath.documentId(), 'in', listId)
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
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.get()
		.then(async (querySnapshot) => {
			let dataUser = [];
			querySnapshot.forEach((doc) => {
				dataUser.push({
					...doc.data(),
					id: doc.id,
				});
			});

			if (dataUser.length === 0) return dataUser;

			let activities = await getActivityByListId(
				dataUser.map((c) => c.id)
			);

			return activities.map((c) => ({
				...dataUser.find((d) => d.id === c.id),
				...c,
			}));
		})
		.catch((error) => console.log(error.message));
};
export const getAllRegisterActivityApi = (userId) => {
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
export const removeRegisterActivityApi = (acId) => {
	let uId = firebase.auth().currentUser.uid;
    db.collection('news').doc(acId).collection('users').doc(uId).delete();
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
		proof: dataActivity.proof || 0,
		studentCode: currentUser().email.slice(0, 10),
		displayName: currentUser().displayName,
	};
	db.collection('news').doc(acId).collection('users').doc(uId).set(data);
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.set(data)
		.then(() => {
			return { ...data, ...dataActivity };
		});
};
export const editProofActivityApi = (acId, number) => {
	let uId = currentUser().uid;
	db.collection('news')
		.doc(acId)
		.collection('users')
		.doc(uId)
		.update({
            confirm: false,
			proof: firebase.firestore.FieldValue.increment(number),
		});
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.update({
			confirm: false,
			proof: firebase.firestore.FieldValue.increment(number),
		})
		.then(() => {
			return { number, acId };
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
export const getOtherActivitiesApi = () => {
	return db
		.collection('news')
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
		});
};
export const getActivitiesApi = (limit = 25) => {
	return db
		.collection('news')
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
		});
};
export const deleteDataApi = (collection, docId) => {
	return db
		.collection(collection || 'news')
		.doc(docId)
		.delete()
		.then(() => docId);
};
export const addDataApi = (collection = 'news', data, docId) => {
	if (docId === null) {
		return db
			.collection(collection)
			.add(data)
			.then((doc) => ({ ...data, id: doc.id }));
	} else {
		return db
			.collection(collection)
			.doc(docId)
			.set(data)
			.then(() => ({ ...data, id: docId }));
	}
};
export const addUserDetailApi = (data) => {
	console.log('data add :', {
		email: currentUser().email,
		userId: currentUser().uid,
		...data,
	});
	return db
		.collection('register_activity')
		.doc(currentUser().uid)
		.set(
			{
				studentCode: currentUser().email.slice(0, 10),
				email: currentUser().email,
				userId: currentUser().uid,
				...data,
			},
			{ merge: true }
		)
		.then(() => ({ ...data }))
		.catch((err) => console.log(err.message));
};
export const getUserDetailApi = () => {
	return db
		.collection('register_activity')
		.doc(currentUser().uid)
		.get()
		.then((res) => res.data())
		.catch((err) => console.log(err.message));
};
export const cancelConfirmMyProofApi = (acId) => {
	let uId = currentUser().uid;
	db.collection('news')
		.doc(acId)
		.collection('users')
		.doc(uId)
		.update({ confirm: false });
	return db
		.collection('register_activity')
		.doc(uId)
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
