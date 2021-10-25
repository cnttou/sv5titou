import {
	deleteFile,
	deleteFileByFullPath,
	getFile,
	getFileFromAActivity,
	upFile,
} from '../../api/firebaseStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getActivitiesApi,
	deleteData,
	addData,
	getRegisterActivityApi,
	registerActivityApi,
	removeRegisterActivity,
	addUrlImageApi,
	removeUrlImageApi,
    getAllActivitiesApi,
} from '../../api/firestore';

export const fetchActivityAction = createAsyncThunk(
	'news/fetchNews',
	async (limit) => {
		let respone = await getActivitiesApi(limit);
		return respone;
	}
);
export const fetchAllActivityAction = createAsyncThunk(
	'news/fetchAllNews',
	async (limit) => {
		let respone = await getAllActivitiesApi(limit);
		return respone;
	}
);

export const addActivityAction = createAsyncThunk(
	'news/addNews',
	async ({ data, docId }) => {
		let response = await addData('news', data, docId);
		console.log('response add activity: ', response);
		return response;
	}
);

export const deleteActivityAction = createAsyncThunk(
	'news/deleteNews',
	async (docId) => {
		let response = await deleteData('news', docId);
		return response;
	}
);

export const fetchRegisteredActivityAction = createAsyncThunk(
	'registerActivity/fetchRegisterActivity',
	async () => {
		let response = await getRegisterActivityApi();
		return response;
	}
);

export const registerActivityAction = createAsyncThunk(
	'registerActivity/registerActivity',
	async (data) => {
		let response = await registerActivityApi(data);
		return response;
	}
);

export const removeRegisteredActivityAction = createAsyncThunk(
	'registerActivity/removeRegisterActivity',
	async (acId) => {
		return await removeRegisterActivity(acId);
	}
);

export const addImageAction = createAsyncThunk(
	'registerActivity/updateImage',
	async ({ file, acId }, thunkAPI) => {
		await upFile(acId, file).then((fileName) => {
			addUrlImageApi(fileName, acId);
		});
		return { fileName: file.name, acId };
	}
);
export const getImageProofByActivityAction = createAsyncThunk(
	'registerActivity/getImageProofByActivityAction',
	async (acId, thunkAPI) => {
		let response = await getFileFromAActivity(acId);
		return { images: response, acId };
	}
);
export const getImageProofAction = createAsyncThunk(
	'registerActivity/getImageProofAction',
	async ({ uid, acId }, thunkAPI) => {
		let response = await getFile(uid, acId);
		console.log('typeof response', typeof response);
		return { images: response, uid, acId };
	}
);
export const deleteImageAction = createAsyncThunk(
	'registerActivity/deleteImage',
	async ({ fileName, acId }, thunkAPI) => {
		await deleteFile(acId, fileName).then((fileName) => {
			removeUrlImageApi(fileName, acId);
		});
		return { fileName, acId };
	}
);
export const deleteImageByFullPathAction = createAsyncThunk(
	'registerActivity/deleteImageByFullPath',
	async ({ path, acId }, thunkAPI) => {
		await deleteFileByFullPath(path);
		return { path, acId };
	}
);
