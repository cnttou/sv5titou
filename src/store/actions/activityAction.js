import {
	deleteFileByFullPathApi,
	deleteFolderImageActivityApi,
	getFileFromAActivityApi,
} from '../../api/firebaseStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActivityApi, UserApi } from '../../api/firestore';

const thunk = (name, callbackApi) => createAsyncThunk(name, callbackApi);

export const getOtherActivityAction = thunk('myActivity/getMyActivity', () =>
	ActivityApi.getMyActivity()
);
export const getRegisterActivityAction = thunk('activity/getActivity', () =>
	ActivityApi.getRegister()
);
export const registerActivityAction = thunk(
	'activity/registerActivity',
	({ id, imageAdd, ...rest }) => UserApi.initMyActivity(id, imageAdd, rest)
);
export const updateProofActivityAction = thunk(
	'myActivity/editProof',
	async ({ id, proof, acId }) => UserApi.updateProof(id, proof, acId)
);
export const deleteProofActivityAction = thunk(
	'myActivity/deleteProof',
	async ({ id, imageId, acId }) => UserApi.deleteImageProof(id, imageId, acId)
);
export const deleteRegisteredActivityAction = createAsyncThunk(
	'registerActivity/removeRegisterActivity',
	({id, acId}) => {
		deleteFolderImageActivityApi(id);
		return UserApi.deleteRegisterActivity(id, acId);
	}
);
export const deleteImageByFullPathAction = thunk(
	'registerActivity/deleteImageByFullPath',
	async ({ path, acId }, thunkAPI) => {
		await deleteFileByFullPathApi(path);
		return { path, acId };
	}
);
