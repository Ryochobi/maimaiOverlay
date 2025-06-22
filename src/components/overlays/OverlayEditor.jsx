import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import "./OverlayEditor.scss";

export default function OverlayEditor() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);
  const [positions, setPositions] = useState({});
  const [background, setBackground] = useState(null);
  const [hiddenKeys, setHiddenKeys] = useState([]);
  const refMap = useRef({});

  useEffect(() => {
    const stored = localStorage.getItem(`overlay-${name}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setConfig(parsed);
      setPositions(parsed.positions || {});
      setHiddenKeys(parsed.hiddenKeys || []);
      setBackground(parsed.background || null);
    }
  }, [name]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/overlay");
    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(await event.data.text());
        setConfig((prev) => {
          const updated = { ...prev, values: { ...prev?.values, ...data } };
          localStorage.setItem(`overlay-${name}`, JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        console.error("Invalid message received in editor:", err);
      }
    };
    return () => ws.close();
  }, [name]);

  const handleDragStop = (key, _, data) => {
    setPositions((prev) => ({ ...prev, [key]: { x: data.x, y: data.y } }));
  };

  const handleSave = () => {
    const updated = { ...config, positions, background, hiddenKeys };
    localStorage.setItem(`overlay-${name}`, JSON.stringify(updated));
    navigate("/overlay");
  };

  const handleExport = () => {
    const blob = new Blob([
      JSON.stringify({ positions, background, hiddenKeys }, null, 2)
    ], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `overlay-${name}-config.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        const imported = JSON.parse(target.result);
        setPositions(imported.positions || {});
        setBackground(imported.background || null);
        setHiddenKeys(imported.hiddenKeys || []);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => setBackground(target.result);
    reader.readAsDataURL(file);
  };

  const restoreFields = () => setHiddenKeys([]);

  if (!config?.values) return <div>Loading overlay config...</div>;

  return (
    <div
      className="editor-container"
    >
      {/* Action bar pinned to top-left */}
      <div className="editor-actions">
        <label className="background-upload">
          🖼 Upload Background
          <input type="file" accept="image/*" onChange={handleBackgroundUpload} hidden />
        </label>
        <button onClick={handleSave}>💾 Save Overlay</button>
        <label className="import-btn">
          📂 Import Config
          <input type="file" accept=".json" onChange={handleImport} hidden />
        </label>
        <button onClick={handleExport}>⬇ Export Config</button>
        <button onClick={restoreFields}>↩ Restore Fields</button>
        <button onClick={() => navigate("/overlay")}>🔙 Back</button>
      </div>
      <div className="editor-canvas" style={background ? { backgroundImage: `url(${background})`, backgroundSize: "cover" } : {}}>
        {/* Render draggable fields */}
      {Object.entries(config.values).map(([key, value]) => {
        if (hiddenKeys.includes(key)) return null;
        const pos = positions[key] || { x: 100, y: 100 };
        const displayText = typeof value === "object" ? JSON.stringify(value) : value;

        if (!refMap.current[key]) refMap.current[key] = React.createRef();

        return (
          <Draggable
            key={key}
            nodeRef={refMap.current[key]}
            defaultPosition={pos}
            onStop={(e, data) => handleDragStop(key, e, data)}
          >
            <div className="editor-field" ref={refMap.current[key]}>
              <span className="field-text">{displayText}</span>
              <button
                className="field-close"
                title="Hide this field"
                onClick={() => setHiddenKeys((prev) => [...prev, key])}
              >
                ×
              </button>
            </div>
          </Draggable>
        );
      })}

      </div>
    </div>
  );
}
