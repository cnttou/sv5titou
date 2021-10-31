import { createReducer } from '@reduxjs/toolkit';
import { addUserDetailAction, getUserDetailAction, loginAction, logoutAction } from '../actions';

const initialState = {
	error: '',
	value: {}, //uid, email, full_name, class, student_code
};
const reducer = createReducer(initialState, (builder) => {
	builder.addCase(loginAction, (state, action) => {
		state.value = action.payload;
	});
	builder.addCase(logoutAction, (state, action) => {
		state.value = {};
	});
    builder.addCase(addUserDetailAction.fulfilled, (state, action)=>{
        state.value = Object.assign(state.value, action.payload)
    })
    builder.addCase(getUserDetailAction.fulfilled, (state, action)=>{
        const data = {...action.payload}
        state.value = Object.assign(state.value, data)
    });
});

export default reducer;
