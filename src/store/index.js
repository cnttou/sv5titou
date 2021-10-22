import { configureStore } from '@reduxjs/toolkit';
import activitySlide from './reducers/activitySlide';
import myActivitySlice from './reducers/myActivitySlice';
import userActivity from './reducers/userActivity';
import userReducer from './reducers/UserSlide';

const store = configureStore({
	reducer: {
		activity: activitySlide,
		myActivity: myActivitySlice,
		user: userReducer,
		userActivity: userActivity,
	},
});

export default store;
