import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OverlayControl from "./components/overlays/OverlayControl";
import { useDispatch, useSelector } from "react-redux";
import { setFields, setCurrentSong, setSelectedSong1, setSelectedSong2, setSelectedSong3, setSelectedSong4, setWheelState, initializeSongs } from "./store/store";
import PlayerView from "./components/overlays/PlayerView";
import Randomizer from "./components/overlays/Randomizer";
import Test from "./components/overlays/Randomizer";

const App = () => {
  const dispatch = useDispatch();
  const currentFields = useSelector((state) => state.fields);

const shuffleArray = (array) => {
  const shuffled = [...array]; // Make a copy to avoid mutating the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

  useEffect(() => {
      const ws = new WebSocket("ws://localhost:8080/overlay");
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(data)
          console.log("Has State?",!!data.state)
          // These are shallow updates
          if (!!data.state) {
            dispatch(setWheelState(data.state));
            if (!!data.songs) {
              dispatch(initializeSongs(shuffleArray(data.songs)));
            }
          } else {
            dispatch(setFields(data.fields));
            dispatch(setSelectedSong1(data.song1));
            dispatch(setSelectedSong2(data.song2));
            dispatch(setSelectedSong3(data.song3));
            dispatch(setSelectedSong4(data.song4));
            dispatch(setCurrentSong(data.currentSong));
          }
        } catch (err) {
          console.error("Invalid WebSocket message:", err);
        }
      };

    }, [currentFields]);

  return (
    <Router>
      <Routes>
        <Route path="/overlay" element={<OverlayControl />} />
        <Route path="/playerView" element={<PlayerView />} />
        <Route path="/gameView" element={<PlayerView />} />
        <Route path="/songView" element={<PlayerView />} />
        <Route path="/totalScore" element={<PlayerView />} />
        <Route path="/random" element={<Randomizer />} />
        
        <Route path="*" element={<Navigate to="/overlay" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
