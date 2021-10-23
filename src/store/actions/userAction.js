import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	addUserDetail,
	cancelConfirmMyProofApi,
	cancelConfirmProof,
	confirmProof,
	getUserActivity,
} from '../../api/firestore';

export const loginAction = createAction('LOGIN');

export const logoutAction = createAction('LOGOUT');

export const addUserDetailAction = createAsyncThunk(
	'user/addUserDetail',
	async (data) => {
		let response = await addUserDetail(data);
		return response;
	}
);

export const fetchUserThunk = createAsyncThunk(
	'user/fetchUserActivity',
	async () => {
		let response = await getUserActivity();
		return response;
	}
);
export const confirmProofThunk = createAsyncThunk(
	'user/confirmProof',
	async ({ uid, acId }) => {
		return await confirmProof(uid, acId);
	}
);
export const cancelConfirmProofThunk = createAsyncThunk(
	'user/cancelConfirmProof',
	async ({ uid, acId, confirm }) => {
		return await cancelConfirmProof(uid, acId, confirm);
	}
);
export const cancelMyConfirmProofAction = createAsyncThunk(
	'user/cancelMyConfirmProof',
	async (acId) => {
		return await cancelConfirmMyProofApi(acId);
	}
);
