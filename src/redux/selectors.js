import { createSelector } from "@reduxjs/toolkit";

// selectors.js
export const makeSelectSongById = () => 
  createSelector(
    [state => state.songs.songs, (_, id) => id],
    (songs, id) => songs.find(song => song.id === id)
  );