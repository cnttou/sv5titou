import { createReducer } from '@reduxjs/toolkit';
import { loginAction, logoutAction } from '../actions';

const initialState = {
	error: '',
	value: {}, //uid, email, full_name, class, student_code
};
const reducer = createReducer(initialState, (builder) => {
	builder.addCase(loginAction, (state, action) => {
		state.value = action.payload;
	});
	builder.addCase(logoutAction, (state, action) => {
		state = initialState;
	});
});

export default reducer;
