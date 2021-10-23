import { toast } from 'react-toastify';
import { currentUser } from './authentication';
import firebase from './firebase';

let storage = firebase.storage();
var storageRef = storage.ref();

var imagesRef = storageRef.child('images');

var metadata = {
	contentType: 'image/jpeg',
};

export const taskEvent = firebase.storage.TaskEvent.STATE_CHANGED;

export const upFile = (acId, file) => {
	let fileProofRef = imagesRef.child(currentUser().uid).child(acId);
	console.log('file upload', file);
	return fileProofRef.child(`/${file.name}`).put(file);
};

export const deleteFile = (acId, fileName) => {
	let fileProofRef = imagesRef.child(currentUser().uid).child(acId);
	return fileProofRef
		.child(`/${fileName}`)
		.delete()
		.then((snapshot) => {
			toast.success('Đã xóa ảnh.');
			return fileName;
		})
		.catch((error) => {
			console.log(error);
			toast.warn('Xóa ảnh thất bại.');
		});
};
export const deleteFileByFullPath = (fullPath = '') => {
	let fileProofRef = storageRef.child(fullPath);

	return fileProofRef.delete();
};
export const deleteFolderImageActivityApi = (acId = '') => {
	let uid = currentUser().uid;
	let folderProofRef = imagesRef.child(uid).child(acId);
	return folderProofRef.listAll().then((res) => {
		let kq = [];
		res.items.forEach((itemRef) => {
			kq.push(itemRef.delete());
		});
		return Promise.all(kq);
	});
};

export const getUrlImage = (acId, fileName, userId) => {
	let uid = userId || currentUser().uid;
	let fileProofRef = imagesRef.child(uid).child(acId);
	return fileProofRef
		.child(`/${fileName}`)
		.getDownloadURL()
		.then((url) => url);
};

export const getFileFromAActivity = (acId) => {
	let uid = currentUser().uid;
	let fileProofRef = imagesRef.child(uid).child(acId);
	return fileProofRef.listAll().then(async (res) => {
		let kq = [];
		let extraRs = [];
		res.items.forEach((itemRef) => {
			extraRs.push({ name: itemRef.name, fullPath: itemRef.fullPath });
			kq.push(itemRef.getDownloadURL());
		});
		let images = await Promise.all(kq);
		return extraRs.map((c, index) => ({ ...c, url: images[index] }));
	});
};

export const getFile = (uid, acId) => {
	let fileProofRef = imagesRef.child(uid).child(acId);
	return fileProofRef
		.listAll()
		.then(async (res) => {
			let kq = [];
			let extraRs = [];
			res.items.forEach((itemRef) => {
				extraRs.push({
					name: itemRef.name,
					fullPath: itemRef.fullPath,
				});
				kq.push(itemRef.getDownloadURL());
			});
			let images = await Promise.all(kq);
			return extraRs.map((c, index) => ({ ...c, url: images[index] }));
		})
		.catch((error) => console.log(error.message));
};
