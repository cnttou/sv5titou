import { configureStore } from '@reduxjs/toolkit';
import {
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import activitySlide from './reducers/activitySlide';
import myActivitySlice from './reducers/myActivitySlice';
import userReducer from './reducers/userSlide';
import otherReducer from './reducers/otherSlide';

export const rootReducer = combineReducers({
	activity: activitySlide,
	myActivity: myActivitySlice,
	user: userReducer,
	other: otherReducer,
});

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	blacklist: ['other', 'user', 'myActivity', 'activity'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

export default store;
