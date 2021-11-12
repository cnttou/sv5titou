import { configureStore } from '@reduxjs/toolkit';
import activitySlide from './reducers/activitySlide';
import myActivitySlice from './reducers/myActivitySlice';
import otherActivity from './reducers/otherActivity';
import userReducer from './reducers/UserSlide';

const store = configureStore({
	reducer: {
		activity: activitySlide,
		myActivity: myActivitySlice,
		user: userReducer,
        otherActivity: otherActivity,
	},
});

export default store;
