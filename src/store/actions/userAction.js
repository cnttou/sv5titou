import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserApi } from '../../api/firestore';

const thunk = (name, callbackApi) => createAsyncThunk(name, callbackApi);

export const loginAction = createAction('LOGIN');

export const logoutAction = createAction('LOGOUT');

export const getUserAction = createAsyncThunk(
	'user/getUserDetail',
	async (data) => {
		return await UserApi.get();
	}
);
export const createOrUpdateUserAction = thunk(
	'user/createOrUpdate',
	(data) => UserApi.setOrUpdate(data)
);
