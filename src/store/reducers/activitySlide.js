import { createSlice } from '@reduxjs/toolkit';

import { fetchActivityAction, logoutAction } from '../actions';

const initialState = {
	value: [],
	loading: 0,
};
export const activity = createSlice({
	name: 'myActivity',
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(fetchActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(fetchActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(logoutAction, (state, action) => {
				state.value = [];
				state.loading = 0;
			});
	},
});

export default activity.reducer;
