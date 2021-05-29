import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getRegisterActivity, registerActivity, removeRegisterActivity} from '../../api/firestore'

export const fetchRegisterActivityThunk = createAsyncThunk(
    'registerActivity/fetchRegisterActivity',
    async () => {
        return await getRegisterActivity();
    }
);

export const registerActivityThunk = createAsyncThunk(
    'registerActivity/registerActivity',
    async ({ acId, name, date, location }) => {
        return await registerActivity(acId, name, date, location);
    }
);

export const removeRegisterActivityThunk = createAsyncThunk(
    'registerActivity/removeRegisterActivity',
    async (acId) => {
        return await removeRegisterActivity(acId);
    }
);

export const activitySlice = createSlice({
    name: 'activity',
    initialState: {
        value: [],
    },
    reducers: {},
    extraReducers: {
        [fetchRegisterActivityThunk.fulfilled]: (state, action) => {
            state.value = action.payload;
        },
        [registerActivityThunk.fulfilled]: (state, action) => {
            state.value.push(action.payload);
        },
        [removeRegisterActivityThunk.fulfilled]: (state, action) => {
            state.value = state.value.filter(c=> c.id != action.payload);
        },
    },
});

export default activitySlice.reducer;
