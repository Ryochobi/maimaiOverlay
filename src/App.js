import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Control from './components/Control';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/control" element={<Control />} />
        {/* Redirect anything else to /control */}
        <Route path="*" element={<Navigate to="/control" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
