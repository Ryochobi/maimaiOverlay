import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import "./OverlayEditor.scss";
import FontToolbar from "../fragment/FontToolbar";
import { useDispatch, useSelector } from "react-redux";
import { setFields, setSongFields } from "../../store/store";

export default function OverlayEditor() {
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State management
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [background, setBackground] = useState(null);
  const [hiddenKeys, setHiddenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [styles, setStyles] = useState({});
  const [positions, setPositions] = useState({});
  const refMap = useRef({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Redux state
  const fields = useSelector((state) => state.fields.fields);
  const songFields = useSelector((state) => state.fields.songFields);
  const totalFields = {...songFields, ...fields};

  // Helper to get default position
  const getDefaultPosition = useCallback((key) => {
    const keys = Object.keys(totalFields);
    const index = keys.indexOf(key);
    return {
      x: 100 + (index * 30),
      y: 100 + (index * 30)
    };
  }, [totalFields]);

  // Load config from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`overlay-${name}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHiddenKeys(parsed.hiddenKeys || []);
        setBackground(parsed.background || null);
        setStyles(parsed.styles || {});
        
        // Initialize positions with safety checks
        if (parsed.positions) {
          const safePositions = {};
          Object.entries(parsed.positions).forEach(([key, pos]) => {
            if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
              safePositions[key] = { x: pos.x, y: pos.y };
            }
          });
          setPositions(safePositions);
        }
      } catch (error) {
        console.error("Failed to load saved config:", error);
      }
    }
    setIsInitialized(true);
  }, [name]);

  // Handle WebSocket updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/overlay");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch(setFields(data.fields));
        dispatch(setSongFields(data.songInformation));
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };
    return () => ws.close();
  }, [name, dispatch]);

  // Initialize positions when fields are available
  useEffect(() => {
    if (isInitialized && Object.keys(totalFields).length > 0) {
      const newPositions = {...positions};
      let needsUpdate = false;
      
      Object.keys(totalFields).forEach(key => {
        if (!newPositions[key] || 
            typeof newPositions[key].x !== 'number' || 
            typeof newPositions[key].y !== 'number') {
          newPositions[key] = getDefaultPosition(key);
          needsUpdate = true;
        }
      });
      
      if (needsUpdate) {
        setPositions(newPositions);
      }
    }
  }, [totalFields, isInitialized, getDefaultPosition]);

  // Style handler
  const handleStyleChange = useCallback((fieldKey, property, value) => {
    setStyles(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        [property]: value
      }
    }));
  }, []);

  // Drag handler with position validation
  const handleDragStop = useCallback((key, _, data) => {
    setPositions(prev => ({
      ...prev,
      [key]: {
        x: Number.isFinite(data.x) ? data.x : prev[key]?.x || 100,
        y: Number.isFinite(data.y) ? data.y : prev[key]?.y || 100
      }
    }));
  }, []);

  // Background image handlers
  const handleBackgroundUrlSubmit = useCallback(() => {
    if (backgroundUrl) {
      setBackground(backgroundUrl);
      setShowUrlInput(false);
      setBackgroundUrl("");
    }
  }, [backgroundUrl]);

  const handleBackgroundUrlChange = useCallback((e) => {
    setBackgroundUrl(e.target.value);
  }, []);

  // File operations
  const handleSave = useCallback(() => {
    const configToSave = {
      positions,
      background,
      hiddenKeys,
      styles
    };
    
    // Save to localStorage
    localStorage.setItem(`overlay-${name}`, JSON.stringify(configToSave));
    
    // Download file
    const blob = new Blob([JSON.stringify(configToSave, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overlay-${name}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    navigate("/overlay");
  }, [positions, background, hiddenKeys, styles, name, navigate]);

  const handleImport = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        const imported = JSON.parse(target.result);
        const safePositions = {};
        
        // Validate and sanitize positions
        if (imported.positions) {
          Object.entries(imported.positions).forEach(([key, pos]) => {
            if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
              safePositions[key] = { x: pos.x, y: pos.y };
            }
          });
        }
        
        setPositions(safePositions);
        setHiddenKeys(imported.hiddenKeys || []);
        setBackground(imported.background || null);
        setStyles(imported.styles || {});
      } catch {
        alert("Invalid config file. Please check the format.");
      }
    };
    reader.readAsText(file);
  }, []);

  const handleExport = useCallback(() => {
    const configToExport = {
      positions,
      background,
      hiddenKeys,
      styles
    };
    
    const blob = new Blob(
      [JSON.stringify(configToExport, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overlay-${name}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [positions, background, hiddenKeys, styles, name]);

  // Field management
  const restoreFields = useCallback(() => setHiddenKeys([]), []);

  if (!isInitialized || Object.keys(totalFields).length === 0) {
    return <div className="loading-message">Loading overlay data...</div>;
  }

  return (
    <div className="editor-container">
      <div className="editor-actions">
        <button onClick={() => setShowUrlInput(true)}>🖼 Set Background Image</button>
        <button onClick={handleSave}>💾 Save Overlay</button>
        <label className="import-btn">
          📂 Import Config
          <input type="file" accept=".json" onChange={handleImport} hidden />
        </label>
        <button onClick={handleExport}>⬇ Export Config</button>
        <button onClick={restoreFields}>↩ Restore Fields</button>
        <button onClick={() => navigate("/overlay")}>🔙 Back</button>
      </div>

      {showUrlInput && (
        <div className="url-popup">
          <div className="url-popup-content">
            <h3>Enter Image URL</h3>
            <input
              type="text"
              value={backgroundUrl}
              onChange={handleBackgroundUrlChange}
              placeholder="https://example.com/image.jpg"
            />
            <div className="url-popup-buttons">
              <button onClick={handleBackgroundUrlSubmit}>Set Background</button>
              <button onClick={() => setShowUrlInput(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedKey && (
        <FontToolbar 
          selectedKey={selectedKey} 
          styles={styles} 
          onStyleChange={handleStyleChange}
        />
      )}

      <div className="editor-canvas-wrapper">
        <div
          className="editor-canvas"
          style={background ? {
            backgroundImage: `url(${background})`,
            backgroundSize: "cover"
          } : {}}
        >
          {Object.entries(totalFields).map(([key, value]) => {
            if (hiddenKeys.includes(key)) return null;
            
            if (!refMap.current[key]) {
              refMap.current[key] = React.createRef();
            }

            // Always ensure we have valid position
            const pos = positions[key] || getDefaultPosition(key);

            return (
              <Draggable
                key={key}
                nodeRef={refMap.current[key]}
                position={pos}
                onStop={(e, data) => handleDragStop(key, e, data)}
              >
                <div
                  className={`editor-field ${selectedKey === key ? "selected" : ""}`}
                  ref={refMap.current[key]}
                  onClick={() => setSelectedKey(key)}
                  style={styles[key] || {}}
                >
                  <span className="field-text">
                    {key}
                  </span>
                  <button
                    className="field-close"
                    title="Hide this field"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHiddenKeys(prev => [...prev, key]);
                    }}
                  >
                    ×
                  </button>
                </div>
              </Draggable>
            );
          })}
        </div>
      </div>
    </div>
  );
}