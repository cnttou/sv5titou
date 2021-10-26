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
	addActivityAction,
	deleteActivityAction,
	fetchActivityAction,
	fetchAllActivityAction,
	getImageProofByActivityAction,
	logoutAction,
} from '../actions';

export const activity = createSlice({
	name: 'myActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	reducers: {
		sortActivityByNameAction: (state, action) => {
			let { sort } = action.payload;

			if (sort === 'nameaz')
				state.value.sort((a, b) => compareStringName(a, b));
			else if (sort === 'nameza')
				state.value.sort((a, b) => compareStringName(b, a));
			else if (sort === 'dateaz')
				state.value.sort((a, b) => compareStringDate(a, b));
			else state.value.sort((a, b) => compareStringDate(b, a));
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
			})
			.addCase(fetchAllActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
			})
			.addCase(deleteActivityAction.fulfilled, (state, action) => {
				state.value = state.value.filter((c) => c.id != action.payload);
			})
			.addCase(addActivityAction.fulfilled, (state, action) => {
				let newValue = state.value.filter(
					(c) => c.id !== action.payload.id
				);
				newValue.push(action.payload);

				state.value = newValue;
			})
			.addCase(logoutAction, (state) => {
				state.value = [];
			});
		builder
			.addMatcher(isPending, (state) => {
				state.loading = state.loading + 1;
			})
			.addMatcher(isRejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addMatcher(isFulfilled, (state) => {
				state.loading = state.loading - 1;
			});
	},
});
export const { sortActivityByNameAction } = activity.actions;
export default activity.reducer;
