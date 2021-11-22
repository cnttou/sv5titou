import { configureStore } from '@reduxjs/toolkit';
import activitySlide from './reducers/activitySlide';
import myActivitySlice from './reducers/myActivitySlice';
import userReducer from './reducers/UserSlide';
import otherReducer from './reducers/otherSlide';

const store = configureStore({
	reducer: {
		activity: activitySlide,
		myActivity: myActivitySlice,
		user: userReducer,
		other: otherReducer,
	},
});

export default store;
