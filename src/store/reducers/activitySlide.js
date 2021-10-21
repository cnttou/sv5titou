import { createSlice } from '@reduxjs/toolkit';
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
	getImageProofByActivityAction,
} from '../actions';

export const activity = createSlice({
	name: 'myActivity',
	initialState: {
		value: [],
	},
	reducers: {
		sortActivityByNameAction: (state, action) => {
			let { typeSort, orderBy } = action.payload;

			if (orderBy === 'name')
				if (typeSort == 'true')
					state.value.sort((a, b) => compareStringName(a, b));
				else state.value.sort((a, b) => compareStringName(b, a));
			else if (orderBy === 'target')
				if (typeSort == 'true')
					state.value.sort((a, b) => compareStringTarget(a, b));
				else state.value.sort((a, b) => compareStringTarget(b, a));
			else if (orderBy === 'date')
				if (typeSort == 'true')
					state.value.sort((a, b) => compareStringDate(a, b));
				else state.value.sort((a, b) => compareStringDate(b, a));
			else {
				if (typeSort == 'true')
					state.value.sort((a, b) => compareNumber(a, b));
				else state.value.sort((a, b) => compareNumber(b, a));
			}
		},
	},
	extraReducers: {
		[fetchActivityAction.fulfilled]: (state, action) => {
			state.value = action.payload;
		},
		[deleteActivityAction.fulfilled]: (state, action) => {
			state.value = state.value.filter((c) => c.id != action.payload);
		},
		[addActivityAction.fulfilled]: (state, action) => {
			state.value.push(action.payload);
		},
		
	},
});
export const { sortActivityByNameAction } = activity.actions;
export default activity.reducer;
