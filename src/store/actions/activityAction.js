import {
	deleteFileByFullPathApi,
	deleteFolderImageActivityApi,
	getFileFromAActivityApi,
} from '../../api/firebaseStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActivityApi, UserApi } from '../../api/firestore';

const thunk = (name, callbackApi) => createAsyncThunk(name, callbackApi);

export const getOtherActivityAction = thunk('myActivity/getOther', () =>
	ActivityApi.getOther()
);
export const getRegisterActivityAction = thunk('activity/getRegister', () =>
	ActivityApi.getRegister()
);
export const registerActivityAction = thunk(
	'activity/registerActivity',
	({ id, proof, imageAdd, ...rest }) =>
		UserApi.initMyActivity(id, proof, imageAdd, rest)
);
export const updateProofActivityAction = thunk(
	'myActivity/editProof',
	async ({ id, proof, imageAdd }) => UserApi.updateProof(id, proof, imageAdd)
);
export const deleteProofActivityAction = thunk(
	'myActivity/deleteProof',
	async ({ id, imageId }) => UserApi.deleteImageProof(id, imageId)
);
export const deleteRegisteredActivityAction = createAsyncThunk(
	'registerActivity/removeRegisterActivity',
	(acId) => {
		deleteFolderImageActivityApi(acId);
		return UserApi.deleteRegisterActivity(acId);
	}
);
export const deleteImageByFullPathAction = thunk(
	'registerActivity/deleteImageByFullPath',
	async ({ path, acId }, thunkAPI) => {
		await deleteFileByFullPathApi(path);
		return { path, acId };
	}
);
