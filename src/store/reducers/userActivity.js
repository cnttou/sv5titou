import {
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from '@reduxjs/toolkit';
import {
	compareNumber,
	compareStringName,
	compareStringDate,
	compareStringTarget,
} from '../../utils/compareFunction';
import {
	cancelConfirmProofThunk,
	confirmProofThunk,
	fetchUserThunk,
} from '../actions';

export const userActivity = createSlice({
	name: 'userActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserThunk.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(confirmProofThunk.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;
				state.value = state.value.map((c) => {
					if (c.userId == uid && c.id == acId) {
						return { ...c, confirm };
					}
					return c;
				});
				state.loading = state.loading - 1;
			})
			.addCase(cancelConfirmProofThunk.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;
				state.value = state.value.map((c) => {
					if (c.userId == uid && c.id == acId) {
						return { ...c, confirm };
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
