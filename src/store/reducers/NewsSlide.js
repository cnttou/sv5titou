import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getData, deleteData, addData } from '../../api/firestore';
import { logoutAction } from './action';

export const fetchNewsThunk = createAsyncThunk(
    'news/fetchNews',
    async (limit) => {
        return await getData('news', limit);
    }
);

export const addNewsThunk = createAsyncThunk(
    'news/addNews',
    async ({ data, docId }) => {
        return await addData('news', data, docId);
    }
);

export const deleteNewsThunk = createAsyncThunk(
    'news/deleteNews',
    async (docId) => {
        return await deleteData('news', docId);
    }
);

export const newsSlice = createSlice({
    name: 'news',
    initialState: {
        value: [],
    },
    reducers: {},
    extraReducers: {
        [fetchNewsThunk.fulfilled]: (state, action) => {
            state.value = action.payload;
        },
        [deleteNewsThunk.fulfilled]: (state, action) => {
            state.value = state.value.filter((c) => c.id != action.payload);
        },
        [addNewsThunk.fulfilled]: (state, action) => {
            state.value.push(action.payload);
        },
        [logoutAction]: (state) => {
            state.value = [];
        },
    },
});

export default newsSlice.reducer;
