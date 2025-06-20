import { configureStore, createSlice } from '@reduxjs/toolkit';

const overlaySlice = createSlice({
  name: 'overlay',
  initialState: {
    data: {},
    visible: false,
  },
  reducers: {
    updateData: (state, action) => {
    state.data = {
        ...state.data,
        ...action.payload,
    };
    },
    hide: (state) => {
      state.visible = false;
    },
  },
});

export const { updateData, hide } = overlaySlice.actions;

const store = configureStore({
  reducer: {
    overlay: overlaySlice.reducer,
  },
});

export default store;
