import { createSlice } from '@reduxjs/toolkit';
import { fetchOtherActivityAction } from '../actions';

export const otherActivitySlice = createSlice({
	name: 'otherActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	reducers: {
		addConfirmOtherActivity: (state, action) => {
			const { confirm, id } = action.payload;
			state.value = state.value.map((c) =>
				c.id === id ? { ...c, confirm } : c
			);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchOtherActivityAction.fulfilled, (state, action) => {
			state.value = action.payload;
			state.loading = state.loading - 1;
		});
		builder.addCase(fetchOtherActivityAction.rejected, (state) => {
			state.loading = state.loading - 1;
		});
		builder.addCase(fetchOtherActivityAction.pending, (state) => {
			state.loading = state.loading + 1;
		});
	},
});

export const { addConfirmOtherActivity } = otherActivitySlice.actions;

export default otherActivitySlice.reducer;
