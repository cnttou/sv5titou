import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getData, deleteData } from '../../api/firestore';

export const fetchNews = createAsyncThunk(
    'news/fetchNews',
    async (limit, thunkAPI) => {
        const response = await getData('news', limit);
        return response;
    }
);

export const deleteNews = createAsyncThunk(
    'news/deleteNews',
    (id, thunkAPI) => {
        deleteData('news', id)
            .then(() => {
                return id;
            })
            .catch(() => {
                return '';
            });
    }
);

export const newsSlice = createSlice({
    name: 'counter',
    initialState: {
        value: [],
    },
    reducers: {
        setRegisterActivity: (state, action) => {
            state.value = action.payload;
        },
        deleteNews: (state, action) => {
            state.value.filter((c) => c.id != action.payload.id);
        },
    },
    extraReducers: {
        [fetchNews.fulfilled]: (state, action) => {
            state.value = action.payload;
        },
        [deleteNews.fulfilled]: (state, action) => {
            state.value = state.value.filter(c=>c.id != action.payload);
        },
    },
});

export const { setRegisterActivity, deleteNews } = newsSlice.actions;

export default newsSlice.reducer;
