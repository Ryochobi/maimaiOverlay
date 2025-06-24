import { configureStore, createSlice } from '@reduxjs/toolkit';

const fieldsSlice = createSlice({
  name: 'fields',
  initialState: {
    songFields: {},
    fields: {},
  },
  reducers: {
    setSongFields: (state, action) => {
      state.songFields = {
          ...state.songInformation,
          ...action.payload,
      };
    },
    setFields: (state, action) => {
      state.fields = {
          ...state.fields,
          ...action.payload,
      };
    },
  }
});

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

export const { setSongFields, setFields } = fieldsSlice.actions;
export const { updateData, hide } = overlaySlice.actions;

const store = configureStore({
  reducer: {
    overlay: overlaySlice.reducer,
    fields: fieldsSlice.reducer
  },
});

export default store;
