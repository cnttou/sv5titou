export const pendingState = (state) => {
	state.loading = state.loading + 1;
};

export const rejectedState = (state) => {
	state.loading = state.loading - 1;
};
