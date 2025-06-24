import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OverlayControl.scss';

export default function OverlayControl() {
  const [overlays, setOverlays] = useState([]);
  const navigate = useNavigate();

  // Load overlay from file
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const overlay = JSON.parse(e.target.result);
        const overlayName = file.name.replace('.json', '').replace('overlay-', '');
        
        // Use the overlay immediately
        navigate(`/overlay/${overlayName}/edit`, { state: { overlay } });
      } catch (err) {
        alert('Invalid overlay file');
      }
    };
    reader.readAsText(file);
  };

  // Export overlay to file
  const handleExport = (overlayName, overlayData) => {
    const blob = new Blob([JSON.stringify(overlayData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overlay-${overlayName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Create new overlay
  const handleNewOverlay = () => {
    const overlayName = prompt('Enter overlay name:');
    if (overlayName) {
      navigate(`/overlay/${overlayName}/edit`, {
        state: {
          overlay: {
            positions: {},
            styles: {},
            background: null,
            values: {},
            hiddenKeys: []
          }
        }
      });
    }
  };

  return (
    <div className="dashboard-container">
      <h1>🎛️ Overlay Control Panel</h1>
      
      <div className="control-actions">
        <button className="btn btn-primary" onClick={handleNewOverlay}>
          ➕ Create New Overlay
        </button>
        
        <label className="btn btn-import">
          📂 Import Overlay
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="file-instructions">
        <p>Overlays are saved as <code>.json</code> files in your downloads folder.</p>
        <p>To edit an existing overlay, import it using the button above.</p>
      </div>
    </div>
  );
}