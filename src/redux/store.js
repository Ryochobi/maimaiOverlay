// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";
import songData from '../songData.json'


const songsSlice = createSlice({
    name: 'songs',
    initialState: {
        songs: songData,
        currentSong: null,
        song1: null,
        song2: null,
        song3: null,
        song4: null
    },
    reducers: {
        setCurrentSong: (state, action) => {
            state.currentSong = action.payload;
        },
        setSelectedSong1: (state, action) => {
            state.song1 = action.payload;
        },
        setSelectedSong2: (state, action) => {
            state.song2 = action.payload;
        },
        setSelectedSong3: (state, action) => {
            state.song3 = action.payload;
        },
        setSelectedSong4: (state, action) => {
            state.song4 = action.payload;
        }
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

export const { updateFields } = fieldsSlice.actions;
export const { setCurrentSong, setSelectedSong1, setSelectedSong2, setSelectedSong3, setSelectedSong4 } = songsSlice.actions;


export const store = configureStore({
  reducer: {
    songs: songsSlice.reducer,
    fields: fieldsSlice.reducer,
  }
});

export default store;

