import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getData, deleteData, addData } from '../../api/firestore';
import {
    compareNumber,
    compareStringName,
    compareStringDate,
    compareStringTarget,
} from '../../utils/compareFunction';
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
    reducers: {
        sortByName: (state, action) => {
            let { typeSort, orderBy } = action.payload;

            if (orderBy === 'name')
                if (typeSort)
                    state.value.sort((a, b) => compareStringName(a, b));
                else state.value.sort((a, b) => compareStringName(b, a));
            else if (orderBy === 'target')
                if (typeSort)
                    state.value.sort((a, b) => compareStringTarget(a, b));
                else state.value.sort((a, b) => compareStringTarget(b, a));
            else if (orderBy === 'date')
                if (typeSort)
                    state.value.sort((a, b) => compareStringDate(a, b));
                else state.value.sort((a, b) => compareStringDate(b, a));
            else {
                if (typeSort) state.value.sort((a, b) => compareNumber(a, b));
                else state.value.sort((a, b) => compareNumber(b, a));
            }
        },
    },
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
export const { sortByName } = newsSlice.actions;
export default newsSlice.reducer;
