import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OverlayControl from "./components/overlays/OverlayControl";
import OverlayEditor from "./components/overlays/OverlayEditor";
import OverlayViewer from "./components/overlays/OverlayViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/overlay" element={<OverlayControl />} />
        <Route path="/overlay/:name/edit" element={<OverlayEditor />} />
        <Route path="/overlay/:name" element={<OverlayViewer />} />
        <Route path="*" element={<Navigate to="/overlay" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
