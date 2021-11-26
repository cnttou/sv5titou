import { createSlice } from '@reduxjs/toolkit';
import {
	addConfirmActivityAction,
	cancelMyConfirmProofAction,
	deleteImageByFullPathAction,
	editProofActivityAction,
	fetchRegisteredActivityAction,
	getImageProofByActivityAction,
	logoutAction,
	registerActivityAction,
	removeRegisteredActivityAction,
} from '../actions';
const pointSort = {
	typeActivity: {
		require: 300,
		other: 200,
		register: 100,
	},
	target: {
		'dao-duc': 100,
		'hoc-tap': 90,
		'the-luc': 80,
		'tinh-nguyen': 70,
		've-ngoai-ngu': 60,
		've-ky-nang': 50,
		'hoi-nhap': 40,
		'tieu-bieu-khac': 30,
	},
};
const handleSort = (activity1, activity2) => {
	let point1 = pointSort.typeActivity[activity1.typeActivity];
	let point2 = pointSort.typeActivity[activity2.typeActivity];
	return point1 - point2;
};

export const myActivitySlice = createSlice({
	name: 'myActivity',
	initialState: {
		value: [],
		loading: 0,
		unregistering: 0,
		registering: 0,
	},
	reducers: {
		addImageToActivityAction: (state, action) => {
			const { acId, image } = action.payload;

			state.value = state.value.map((c) =>
				c.id === acId
					? {
							...c,
							images: c.images ? [...c.images, image] : [image],
					  }
					: c
			);
		},
		addMoreMyActivityAction: (state, action) => {
			state.value = [...state.value, ...action.payload].sort((a, b) =>
				handleSort(b, a)
			);
		},
		syncMoreMyActivityAction: (state, action) => {
            const lastData = action.payload;
            state.value = state.value.map(activity=>{
                const lastActivity = lastData.find(c=> c.id === activity.id)
                if (lastActivity) return {...activity, ...lastActivity}
                else return activity
            }).sort((a, b) =>
				handleSort(b, a)
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addConfirmActivityAction.fulfilled, (state, action) => {
				const { acId, proof, confirm } = action.payload;
				state.value = state.value.map((c) =>
					c.id === acId ? { ...c, proof, confirm } : c
				);
			})
			.addCase(cancelMyConfirmProofAction.fulfilled, (state, action) => {
				const { acId, confirm } = action.payload;
				state.value = state.value.map((c) =>
					c.id === acId ? { ...c, confirm } : c
				);
			})
			.addCase(editProofActivityAction.fulfilled, (state, action) => {
				const { number, acId } = action.payload;
				state.value = state.value.map((c) =>
					c.id === acId ? { ...c, proof: c.proof + number, confirm: false } : c
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
			.addCase(
				removeRegisteredActivityAction.fulfilled,
				(state, action) => {
					state.value = state.value.filter(
						(c) => c.id != action.payload
					);
					state.unregistering = state.unregistering - 1;
				}
			)
			.addCase(removeRegisteredActivityAction.pending, (state) => {
				state.unregistering = state.unregistering + 1;
			})
			.addCase(removeRegisteredActivityAction.rejected, (state) => {
				state.unregistering = state.unregistering - 1;
			});
		builder
			.addCase(
				fetchRegisteredActivityAction.fulfilled,
				(state, action) => {
					state.value = action.payload;
					state.loading = state.loading - 1;
				}
			)
			.addCase(fetchRegisteredActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchRegisteredActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
		builder
			.addCase(registerActivityAction.fulfilled, (state, action) => {
				let flagExsit = false;
				const { id: acId, ...restData } = action.payload;

				state.value = state.value.map((c) => {
					if (c.id === acId) {
						flagExsit = true;
						return { ...c, ...restData };
					} else return c;
				});
                
				if (flagExsit === false) state.value.push(action.payload);
				state.registering = state.registering - 1;
			})
			.addCase(registerActivityAction.pending, (state) => {
				state.registering = state.registering + 1;
			})
			.addCase(registerActivityAction.rejected, (state) => {
				state.registering = state.registering - 1;
			});
	},
});

export const {
	addImageToActivityAction,
	addMoreMyActivityAction,
	syncMoreMyActivityAction,
} = myActivitySlice.actions;

export default myActivitySlice.reducer;
