import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './reducers/NewsSlide';
import activityReducer from './reducers/ActivitySlide';
import userReducer from './reducers/UserSlide';

export default configureStore({
    reducer: {
        news: newsReducer,
        activitis: activityReducer,
        user: userReducer,
    },
});
