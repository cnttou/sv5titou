import { createReducer } from '@reduxjs/toolkit';
import {
	createOrUpdateUserAction,
	getUserAction,
	loginAction,
	logoutAction,
} from '../actions';

const initialState = {
	error: '',
	value: {},
	loading: 0, //uid, email, full_name, class, student_code
};
const reducer = createReducer(initialState, (builder) => {
	builder.addCase(
		createOrUpdateUserAction.fulfilled,
		(state, action) => {
			state.value = { ...state.value, ...action.payload };
		}
	);
	builder
		.addCase(getUserAction.fulfilled, (state, action) => {
			state.value = action.payload;
			state.loading = state.loading - 1;
		})
		.addCase(getUserAction.pending, (state) => {
			state.loading = state.loading + 1;
		})
		.addCase(getUserAction.rejected, (state) => {
			state.loading = state.loading - 1;
		});

    builder.addCase(loginAction, (state, action) => {
		state.value = action.payload;
	});
	builder.addCase(logoutAction, (state, action) => {
		state.value = {};
		state.error = '';
		state.loading = 0;
	});
});

export default reducer;
