import {
	deleteFileByFullPathApi,
	getFileFromAActivityApi,
} from '../../api/firebaseStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getActivitiesApi,
	getRegisterActivityApi,
	registerActivityApi,
	deleteRegisterActivityApi,
	editProofActivityApi,
} from '../../api/firestore';

export const fetchActivityAction = createAsyncThunk(
	'news/fetchNews',
	async (limit) => {
		let respone = await getActivitiesApi(limit);
		return respone;
	}
);
export const editProofActivityAction = createAsyncThunk(
	'news/editProofActivity',
	async ({ acId, number }) => {
		let respone = await editProofActivityApi(acId, number);
		return respone;
	}
);

export const fetchRegisteredActivityAction = createAsyncThunk(
	'registerActivity/fetchRegisterActivity',
	async (userId) => {
		let response = getRegisterActivityApi(userId);
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

export const addConfirmActivityAction = createAsyncThunk(
	'registerActivity/addConfirmActivity',
	async (data) => {
		let response = await registerActivityApi(data);
		return response;
	}
);

export const removeRegisteredActivityAction = createAsyncThunk(
	'registerActivity/removeRegisterActivity',
	async (acId) => {
		return await deleteRegisterActivityApi(acId);
	}
);

export const getImageProofByActivityAction = createAsyncThunk(
	'registerActivity/getImageProofByActivityAction',
	async (acId, thunkAPI) => {
		let response = await getFileFromAActivityApi(acId);
		return { images: response, acId };
	}
);

export const deleteImageByFullPathAction = createAsyncThunk(
	'registerActivity/deleteImageByFullPath',
	async ({ path, acId }, thunkAPI) => {
		await deleteFileByFullPathApi(path);
		return { path, acId };
	}
);
