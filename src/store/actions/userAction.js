import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	cancelConfirmProof,
	confirmProof,
	getUserActivity,
} from '../../api/firestore';

export const loginAction = createAction("LOGIN")

export const logoutAction = createAction('LOGOUT');

export const fetchUserThunk = createAsyncThunk(
	'user/fetchUserActivity',
	async () => {
		return await getUserActivity();
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
	async ({ uid, acId }) => {
		return await cancelConfirmProof(uid, acId);
	}
);
