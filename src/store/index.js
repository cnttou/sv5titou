import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './reducers/NewsSlide';
import activityReducer from './reducers/ActivitySlide';

export default configureStore({
    reducer: {
        news: newsReducer,
        activitis: activityReducer
    },
});
