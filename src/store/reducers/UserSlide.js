import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    cancelConfirmProof,
    confirmProof,
    getUserActivity,
} from '../../api/firestore';
import { logoutAction } from './action';

export const fetchUserThunk = createAsyncThunk(
    'user/fetchUserActivity',
    async () => {
        return await getUserActivity();
    }
);
export const confirmProofThunk = createAsyncThunk(
    'user/confirmProof',
    async ({uid, acId}) => {
        return await confirmProof(uid, acId);
    }
);
export const cancelConfirmProofThunk = createAsyncThunk(
    'user/cancelConfirmProof',
    async ({uid, acId}) => {
        return await cancelConfirmProof(uid, acId);
    }
);

export const activitySlice = createSlice({
    name: 'user',
    initialState: {
        value: [],
    },
    reducers: {},
    extraReducers: {
        [fetchUserThunk.fulfilled]: (state, action) => {
            state.value = action.payload;
        },
        [confirmProofThunk.fulfilled]: (state, action) => {
            const { uid, acId, confirm } = action.payload;
            state.value = state.value.map((c) => {
                if (c.userId == uid && c.id == acId) {
                    return { ...c, confirm };
                }
                return c;
            });
        },
        [cancelConfirmProofThunk.fulfilled]: (state, action) => {
            const { uid, acId, confirm } = action.payload;
            state.value = state.value.map((c) => {
                if (c.userId == uid && c.id == acId) {
                    return { ...c, confirm };
                }
                return c;
            });
        },
        [logoutAction]: (state) => {
            state.value = [];
        },
    },
});

export default activitySlice.reducer;
