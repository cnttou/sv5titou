import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	addUserDetailApi,
	cancelConfirmMyProofApi,
    getUserDetailApi,
} from '../../api/firestore';

export const loginAction = createAction('LOGIN');

export const logoutAction = createAction('LOGOUT');

export const addUserDetailAction = createAsyncThunk(
	'user/addUserDetail',
	async (data) => {
		let response = await addUserDetailApi(data);
		return response;
	}
);

export const getUserDetailAction = createAsyncThunk(
	'user/getUserDetail',
	async (data) => {
		let response = await getUserDetailApi(data);
		return response;
	}
);

export const cancelMyConfirmProofAction = createAsyncThunk(
	'user/cancelMyConfirmProof',
	async (acId) => {
		return await cancelConfirmMyProofApi(acId);
	}
);
