import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserApi } from '../../api/firestore';

const thunk = (name, callbackApi) => createAsyncThunk(name, callbackApi);

export const loginAction = createAction('LOGIN');

export const logoutAction = createAction('LOGOUT');

export const getUserAction = createAsyncThunk(
	'user/getUserDetail',
	async (data, thunkApi) => {
		const userResponese = await UserApi.get();
		const state = thunkApi.getState();
		return { ...userResponese, allActivitiy: state.activity.value };
	}
);
export const createOrUpdateUserAction = thunk(
	'user/createOrUpdate',
	(data) => UserApi.setOrUpdate(data)
);
