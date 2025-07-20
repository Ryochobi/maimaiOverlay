import { useState } from "react";
import { useSelector } from "react-redux";

import "./RandomizerField.scss";
import Button from "./Button";
import { useSocket } from "../providers/SocketProvider";

const RandomizerField = () => {
  const songs = useSelector((state) => state.songs.songs);
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const socket = useSocket();
  
  const initializeWheel = () => {
    const songPayload = songs.filter(song => {
        const withinMin = minLevel === "" || song.values.internalLevelValue >= parseFloat(minLevel);
        const withinMax = maxLevel === "" || song.values.internalLevelValue <= parseFloat(maxLevel);
        return withinMin && withinMax && song.values.type !== "utage"
    })

    const payload = {songs: songPayload, state: "ready"}
    socket.send(JSON.stringify(payload))
  }

  const spinWheel = () => {
    socket.send(JSON.stringify({state: "spin"}))
  }

  const stopWheel = () => {
    socket.send(JSON.stringify({state: "stop"}))
  }

  return (
    <div className="randomizer-container">
      {/* Search + Dropdown */}
      <div className="randomizer-buttons">
        <Button onClick={initializeWheel}>Initialize</Button>
        <Button onClick={spinWheel} className="primary">Spin</Button>
        <Button onClick={stopWheel} className="error">Stop</Button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <label className="filter-label">Min Level</label>
        <input
          type="number"
          step="0.1"
          value={minLevel}
          onChange={(e) => setMinLevel(e.target.value)}
          className="filter-input"
        />
        <label className="filter-label">Max Level</label>
        <input
          type="number"
          step="0.1"
          value={maxLevel}
          onChange={(e) => setMaxLevel(e.target.value)}
          className="filter-input"
        />
      </div>
    </div>
  );
};

export default RandomizerField;
