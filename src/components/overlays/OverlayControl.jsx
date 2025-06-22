import React from "react";
import { useNavigate } from "react-router-dom";
import "./OverlayControl.scss";

export default function OverlayControl() {
  const navigate = useNavigate();

  const handleDelete = (overlayName) => {
  const confirmDelete = window.confirm(`Delete overlay "${overlayName}"?`);
  if (confirmDelete) {
    localStorage.removeItem(`overlay-${overlayName}`);
    window.location.reload(); // Or re-trigger state update if preferred
  }
};


  // Get all overlays from localStorage
  const overlays = Object.keys(localStorage)
    .filter((key) => key.startsWith("overlay-"))
    .map((key) => {
      const raw = localStorage.getItem(key);
      try {
        const parsed = JSON.parse(raw);
        return {
          name: key.replace("overlay-", ""),
          data: parsed,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return (
    <div className="dashboard-container">
      <h1>🎛️ Overlay Control Panel</h1>

      {overlays.length === 0 ? (
        <p>No overlays found.</p>
      ) : (
        <div className="overlay-list">
          {overlays.map((overlay) => (
            <div className="overlay-card" key={overlay.name}>
              <h2>{overlay.name}</h2>
              <div className="overlay-actions">
  <button className="btn" onClick={() => navigate(`/overlay/${overlay.name}`)}>
    👀 View
  </button>
  <button className="btn" onClick={() => navigate(`/overlay/${overlay.name}/edit`)}>
    ✏️ Edit
  </button>
  <button className="btn btn-danger" onClick={() => handleDelete(overlay.name)}>
    🗑️ Delete
  </button>
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
