import { createReducer } from '@reduxjs/toolkit';
import {
    deleteProofActivityAction,
	deleteRegisteredActivityAction,
	getOtherActivityAction,
	getRegisterActivityAction,
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
		.addCase(registerActivityAction.fulfilled, (state, { payload }) => {
			state.value[payload.acId] = {
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
			const { proof, acId } = payload;
			state.value[acId].proof = { ...proof, ...state.value[acId].proof };
		})
	builder
		.addCase(deleteProofActivityAction.fulfilled, (state, { payload }) => {
			const { acId, imageId } = payload;
            state.value[acId].confirm = false;
			delete state.value[acId].proof[imageId];
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
		state.value = {};
		state.unregistering = 0;
		state.registering = 0;
		state.loading = 0;
	});
});

export default myActivitySlice;
