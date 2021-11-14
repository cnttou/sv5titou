import { configureStore } from '@reduxjs/toolkit';
import activitySlide from './reducers/activitySlide';
import myActivitySlice from './reducers/myActivitySlice';
import userReducer from './reducers/UserSlide';

const store = configureStore({
	reducer: {
		activity: activitySlide,
		myActivity: myActivitySlice,
		user: userReducer,
	},
});

export default store;
