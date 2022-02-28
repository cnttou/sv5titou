import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';
import { compareStringDate } from '../../utils/compareFunction';
import {
	getRegisterActivityAction,
	logoutAction,
} from '../actions';
import { pendingState, rejectedState } from './shareFunction';

const initialState = {
	value: [],
	loading: 0,
};

const activity = createReducer(initialState, (builder) => {
	builder
		.addCase(getRegisterActivityAction.fulfilled, (state, { payload }) => {
			const data = Object.values(payload);
			state.value = data.sort((a, b) => compareStringDate(b, a));
			state.loading -= 1;
		})
		.addCase(getRegisterActivityAction.pending, pendingState)
		.addCase(getRegisterActivityAction.rejected, rejectedState);
	
    builder.addCase(logoutAction, (state) => {
		state.value = [];
		state.unregistering = 0;
		state.registering = 0;
		state.loading = 0;
	});
});

export default activity;
