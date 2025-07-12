import {
    configureStore,
    createSlice
} from '@reduxjs/toolkit';

const fieldsSlice = createSlice({
    name: 'fields',
    initialState: {
        currentSong: null,
        song1: null,
        song2: null,
        song3: null,
        song4: null,
        fields: {},
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
        },
        setFields: (state, action) => {
            state.fields = {
                ...state.fields,
                ...action.payload,
            };
        },
    }
});

const randomizerSlice = createSlice({
    name: 'randomizer',
    initialState: {
        state: null,
        songs: null,
    },
    reducers: {
        initializeSongs: (state, action) => {
            state.songs = action.payload;
        },
        setWheelState: (state, action) => {
            state.state = action.payload;
        },
    }
});

export const {
    setCurrentSong,
    setSelectedSong1,setSelectedSong2,setSelectedSong3,setSelectedSong4,
    setFields
} = fieldsSlice.actions;

export const {
  initializeSongs,
  setWheelState
} = randomizerSlice.actions;

const store = configureStore({
    reducer: {
        fields: fieldsSlice.reducer,
        randomizer: randomizerSlice.reducer
    },
});

export default store;