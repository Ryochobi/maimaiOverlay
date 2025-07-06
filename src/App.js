import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OverlayControl from "./components/overlays/OverlayControl";
import { useDispatch } from "react-redux";
import { setFields, setCurrentSong, setSelectedSong1, setSelectedSong2, setSelectedSong3, setSelectedSong4 } from "./store/store";
import PlayerView from "./components/overlays/PlayerView";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
      const ws = new WebSocket("ws://localhost:8080/overlay");
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('asd')
          console.log(data)
          dispatch(setFields(data.fields));
          dispatch(setSelectedSong1(data.song1));
          dispatch(setSelectedSong2(data.song2));
          dispatch(setSelectedSong3(data.song3));
          dispatch(setSelectedSong4(data.song4));
          dispatch(setCurrentSong(data.currentSong));
        } catch (err) {
          console.error("Invalid WebSocket message:", err);
        }
      };
    }, []);

  return (
    <Router>
      <Routes>
        <Route path="/overlay" element={<OverlayControl />} />
        <Route path="/playerView" element={<PlayerView />} />
        <Route path="/gameView" element={<PlayerView />} />
        <Route path="/songView" element={<PlayerView />} />
        <Route path="/totalScore" element={<PlayerView />} />
        <Route path="/random" element={<PlayerView />} />
        
        <Route path="*" element={<Navigate to="/overlay" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
