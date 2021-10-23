import { createSlice } from '@reduxjs/toolkit';
import {
	cancelConfirmProofThunk,
	confirmProofThunk,
	fetchUserThunk,
	getImageProofAction,
} from '../actions';

export const userActivity = createSlice({
	name: 'userActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getImageProofAction.fulfilled, (state, action) => {
				const { uid, acId, images } = action.payload;
				state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, images } : d
						);
					}
					return c;
				});
			})
			.addCase(fetchUserThunk.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(confirmProofThunk.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;
                
                state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, confirm } : d
						);
					}
					return c;
				});

				state.loading = state.loading - 1;
			})
			.addCase(cancelConfirmProofThunk.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;

                state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, confirm } : d
						);
					}
					return c;
				});
				state.loading = state.loading - 1;
			})
			.addCase(fetchUserThunk.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(cancelConfirmProofThunk.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(confirmProofThunk.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchUserThunk.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(cancelConfirmProofThunk.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(confirmProofThunk.rejected, (state) => {
				state.loading = state.loading - 1;
			});
	},
});
export default userActivity.reducer;
