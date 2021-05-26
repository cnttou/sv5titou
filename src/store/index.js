import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './reducers/slide';

export default configureStore({
    reducer: {
        counter: counterReducer,
    },
});
