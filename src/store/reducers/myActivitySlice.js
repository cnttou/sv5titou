import { createReducer } from '@reduxjs/toolkit';
import {
    deleteProofActivityAction,
	deleteRegisteredActivityAction,
	getOtherActivityAction,
	getRegisterActivityAction,
	getUserAction,
	logoutAction,
	registerActivityAction,
	updateProofActivityAction,
} from '../actions';
import { pendingState, rejectedState } from './shareFunction';

const initialState = {
	value: {},
	loading: 0,
	unregistering: 0,
	registering: 0,
};
const myActivitySlice = createReducer(initialState, (builder) => {
	builder
		.addCase(getOtherActivityAction.fulfilled, (state, { payload }) => {
			Object.entries(payload).forEach(([id, activity]) => {
				state.value[id] = { ...activity, ...state.value[id] };
			});
			state.loading -= 1;
		})
		.addCase(getOtherActivityAction.pending, pendingState)
		.addCase(getOtherActivityAction.rejected, rejectedState);
	builder
		.addCase(getUserAction.fulfilled, (state, { payload }) => {
			const { allActivitiy, activities } = payload;
			Object.entries(activities).forEach(([id, value]) => {
				state.value[id] = {
					...state.value[id],
					...value,
					...allActivitiy.find((c) => c.id === id),
				};
			});

			state.loading -= 1;
		})
		.addCase(getUserAction.pending, pendingState)
		.addCase(getUserAction.rejected, rejectedState);
	builder
		.addCase(getRegisterActivityAction.fulfilled, (state, { payload }) => {
			Object.entries(state.value).forEach(([id, activity]) => {
				if (payload[id])
					state.value[id] = {
						...activity,
						...payload[id],
					};
			});

			state.loading -= 1;
		})
		.addCase(getRegisterActivityAction.pending, pendingState)
		.addCase(getRegisterActivityAction.rejected, rejectedState);

	builder
		.addCase(registerActivityAction.fulfilled, (state, { payload }) => {
			state.value[payload.id] = {
				...state.value[payload.id],
				...payload,
			};
			state.registering -= 1;
		})
		.addCase(registerActivityAction.pending, (state) => {
			state.registering += 1;
		})
		.addCase(registerActivityAction.rejected, (state) => {
			state.registering -= 1;
		});
	builder
		.addCase(updateProofActivityAction.fulfilled, (state, { payload }) => {
			const { proof, id, imageAdd } = payload;
			state.value[id].proof += proof;
			state.value[id].images[imageAdd.name.split('.')[0]] = imageAdd;
		})
	builder
		.addCase(deleteProofActivityAction.fulfilled, (state, { payload }) => {
			const { id, imageId } = payload;
			state.value[id].proof -= 1;
            state.value[id].confirm = false;
			delete state.value[id].images[imageId];
		})
	builder
		.addCase(
			deleteRegisteredActivityAction.fulfilled,
			(state, { payload: id }) => {
				delete state.value[id];
				state.unregistering -= 1;
			}
		)
		.addCase(deleteRegisteredActivityAction.pending, (state) => {
			state.unregistering += 1;
		})
		.addCase(deleteRegisteredActivityAction.rejected, (state) => {
			state.unregistering -= 1;
		});
	builder.addCase(logoutAction, (state) => {
		state.value = [];
		state.unregistering = 0;
		state.registering = 0;
		state.loading = 0;
	});
});

export default myActivitySlice;
