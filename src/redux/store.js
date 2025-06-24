// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";
import songData from '../songData.json'


const songsSlice = createSlice({
    name: 'songs',
    initialState: {
        songs: songData,
        selectedSong: null
    },
    reducers: {
        setSelectedSong: (state, action) => {
            state.selectedSong = action.payload;
        },
    }
})

const fieldsSlice = createSlice({
    name: 'fields',
    initialState: {
        values: {}
    },
    reducers: {
        updateFields: (state, action) => {
        state.values = {
            ...state.values,
            ...action.payload,
        };
    },
    }
})

// const overlaySlice = createSlice({
//   name: 'overlay',
//   initialState: {
//     data: {},
//     visible: false,
//   },
//   reducers: {
    
//     hide: (state) => {
//       state.visible = false;
//     },
//     updateOverlayValues: (state, action) => {
//       state.values = action.payload;
//     }
//   },
// });

// export const { hide, updateOverlayValues } = overlaySlice.actions;
export const { updateFields } = fieldsSlice.actions;
export const { setSelectedSong } = songsSlice.actions;


export const store = configureStore({
  reducer: {
    songs: songsSlice.reducer,
    fields: fieldsSlice.reducer,
    // overlay: overlaySlice.reducer,
  },
});

export default store;

