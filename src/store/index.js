import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './reducers/NewsSlide';
import registerActivityReducer from './reducers/ManageRegisterActivity';

export default configureStore({
    reducer: {
        news: newsReducer,
        registerActivity: registerActivityReducer
    },
});
