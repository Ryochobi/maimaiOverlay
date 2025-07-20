import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentSong ,setSelectedSong1, setSelectedSong2, setSelectedSong3,setSelectedSong4 } from "../redux/store";

import "./SongField.scss";


const SongField = ({
    field
}) => {
  const songs = useSelector((state) => state.songs.songs);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!songs) return;
    if (query === '') {
      setShowSuggestions(false);
    }

    let result = songs.filter((item) => {
      const { internalLevelValue, title, } = item.values;
      const matchesQuery = title.toLowerCase().includes(query.toLowerCase());
      const withinMin = minLevel === "" || internalLevelValue >= parseFloat(minLevel);
      const withinMax = maxLevel === "" || internalLevelValue <= parseFloat(maxLevel);
      return matchesQuery && withinMin && withinMax;
    });

    setFiltered(result);
  }, [query, minLevel, maxLevel, songs]);

  const handleSelect = (id) => {
    setQuery(id);
    setShowSuggestions(false);
     const selectedSong = songs.find(
        (song) => song.id === id
      );
      
    if (field.name === "currentSong") {
      dispatch(setCurrentSong(selectedSong));
    }
    if (field.name === "song1") {
      dispatch(setSelectedSong1(selectedSong));
    }
    if (field.name === "song2") {
      dispatch(setSelectedSong2(selectedSong));
    }
    if (field.name === "song3") {
      dispatch(setSelectedSong3(selectedSong));
    }
    if (field.name === "song4") {
      dispatch(setSelectedSong4(selectedSong));
    }
  };

  return (
    <div className="select-container">
      {/* Search + Dropdown */}
      <div className="dropdown-container">
        <input
          type="text"
          className="select-input"
          placeholder="Search by title"
          key={field}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && filtered.length > 0 && (
          <ul className="dropdown-list">
            {filtered.map((item, index) => (
                <li
                key={index}
                onClick={() => handleSelect(item.id)}
                className="dropdown-item"
                >
                  {item.id}
                </li>
            ))}
            </ul>
        )}
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

export default SongField;
