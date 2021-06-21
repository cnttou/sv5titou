import { toast } from 'react-toastify';
import { currentUser } from './authentication';
import firebase from './firebase';

let storage = firebase.storage();
var storageRef = storage.ref();

var imagesRef = storageRef.child('images');

var metadata = {
    contentType: 'image/jpeg',
};

export const upFile = (acId, file) => {
    let fileProofRef = imagesRef.child(currentUser().uid).child(acId);
    return fileProofRef
        .child(`/${file.name}`)
        .put(file, metadata)
        .then((snapshot) => {
            toast.success('Đã tải ảnh lên.');
            return file.name;
        }).catch((error)=>{
            console.log(error)
            toast.warn('Đã tải ảnh lên thất bại.');
        });
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

export const getUrlImage=(acId, fileName, userId)=>{
    let uid = userId || currentUser().uid;
    let fileProofRef = imagesRef.child(uid).child(acId);
    return fileProofRef.child(`/${fileName}`).getDownloadURL().then(url=>url);
}
