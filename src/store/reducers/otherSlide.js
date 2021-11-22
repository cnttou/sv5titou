import { createAction, createReducer } from '@reduxjs/toolkit';

export const hideSlideShow = createAction('HIDE_SLIDESHOW');
export const addSlideShow = createAction('ADD_SLIDESHOW');

const initialState = {
	isShowSlide: true,
	slideShowItems: [],
};

const reducer = createReducer(initialState, (builder) => {
	builder
		.addCase(hideSlideShow, (state, action) => {
			state.isShowSlide = false;
		})
		.addCase(addSlideShow, (state, action)=>{
            state.slideShowItems = action.payload;
        });
});

export default reducer;
