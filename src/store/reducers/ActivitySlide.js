import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteFile, upFile } from '../../api/firebaseStorage';
import {
    getRegisterActivity,
    registerActivity,
    removeRegisterActivity,
    addImage,
    deleteImage,
} from '../../api/firestore';
import { logoutAction } from './action';

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

export const addImageThunk = createAsyncThunk(
    'registerActivity/updateImage',
    async ({ file, acId }, thunkAPI) => {
        await upFile(acId, file).then((fileName) => {
            addImage(fileName, acId);
        });
        return { fileName: file.name, acId };
    }
);
export const deleteImageThunk = createAsyncThunk(
    'registerActivity/deleteImage',
    async ({ fileName, acId }, thunkAPI) => {
        await deleteFile(acId, fileName).then((fileName) => {
            deleteImage(fileName, acId);
        });
        return { fileName, acId };
    }
);

export const activitySlice = createSlice({
    name: 'activity',
    initialState: {
        value: [],
        loading: 0,
    },
    reducers: {},
    extraReducers: {
        [fetchRegisterActivityThunk.fulfilled]: (state, action) => {
            state.value = action.payload;
            state.loading = state.loading - 1;
        },
        [fetchRegisterActivityThunk.pending]: (state, action) => {
            state.loading = state.loading + 1;
        },
        [registerActivityThunk.fulfilled]: (state, action) => {
            state.value.push(action.payload);
        },
        [removeRegisterActivityThunk.fulfilled]: (state, action) => {
            state.value = state.value.filter((c) => c.id != action.payload);
        },
        [addImageThunk.fulfilled]: (state, action) => {
            const { fileName, acId } = action.payload;
            state.value = state.value.map((c) => {
                if (c.id == acId) {
                    let images = c.images || [];
                    images.push(fileName);
                    return { ...c, images };
                }
                return c;
            });
        },
        [deleteImageThunk.fulfilled]: (state, action) => {
            const { fileName, acId } = action.payload;
            state.value = state.value.map((c) => {
                if (c.id == acId) {
                    let images = c.images;
                    images.splice(images.indexOf(fileName), 1);
                    return { ...c, images };
                }
                return c;
            });
        },
        [logoutAction]: (state) => {
            state.value = [];
        },
    },
});

export const { addImageAction } = activitySlice.actions;
export default activitySlice.reducer;
