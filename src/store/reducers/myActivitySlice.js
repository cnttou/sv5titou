import { createSlice } from '@reduxjs/toolkit';
import {
	cancelMyConfirmProofAction,
	deleteImageByFullPathAction,
	editProofActivityAction,
	fetchRegisteredActivityAction,
	getImageProofByActivityAction,
	logoutAction,
	registerActivityAction,
	removeRegisteredActivityAction,
} from '../actions';

export const myActivitySlice = createSlice({
	name: 'myActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	reducers: {
		addImageToActivityAction: (state, action) => {
			const { acId, image } = action.payload;
			let images = state.value.find((c) => c.id === acId)['images'] || [];
			images.push(image);

			let newValue = state.value.map((c) =>
				c.id === acId
					? {
							...c,
							images,
					  }
					: c
			);
			state.value = newValue;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(
				fetchRegisteredActivityAction.fulfilled,
				(state, action) => {
					state.value = action.payload;
					state.loading = state.loading - 1;
				}
			)
			.addCase(registerActivityAction.fulfilled, (state, action) => {
				state.value.push(action.payload);
				state.loading = state.loading - 1;
			})
			.addCase(
				removeRegisteredActivityAction.fulfilled,
				(state, action) => {
					state.value = state.value.filter(
						(c) => c.id != action.payload
					);
				}
			)
			.addCase(cancelMyConfirmProofAction.fulfilled, (state, action) => {
				const { acId, confirm } = action.payload;
				state.value = state.value.map((c) =>
					c.id === acId ? { ...c, confirm } : c
				);
			})
			.addCase(editProofActivityAction.fulfilled, (state, action) => {
				const { number, acId } = action.payload;
				state.value = state.value.map((c) =>
					c.id === acId ? { ...c, proof: c.proof + number } : c
				);
			})
			.addCase(deleteImageByFullPathAction.fulfilled, (state, action) => {
				const { path, acId } = action.payload;
				state.value = state.value.map((c) => {
					if (c.id === acId) {
						let images = c.images.filter(
							(e) => e.fullPath !== path
						);
						return { ...c, images };
					}
					return c;
				});
			})
			.addCase(
				getImageProofByActivityAction.fulfilled,
				(state, action) => {
					const { acId, images } = action.payload;
					let newState = state.value.map((c) =>
						c.id === acId ? { ...c, images } : c
					);
					state.value = newState;
				}
			)
			.addCase(logoutAction, (state) => {
				state.value = [];
			});
		builder
			.addCase(fetchRegisteredActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchRegisteredActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(registerActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(registerActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
	},
});

export const { addImageToActivityAction } = myActivitySlice.actions;

export default myActivitySlice.reducer;
