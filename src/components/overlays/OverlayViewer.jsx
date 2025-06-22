import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "./OverlayViewer.scss";

export default function OverlayViewer() {
  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const page = searchParams.get("page") || "default";

  useEffect(() => {
    const stored = localStorage.getItem(`overlay-${name}`);
    if (stored) {
      setConfig(JSON.parse(stored));
    }
  }, [name]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/overlay");
    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setFieldValues(parsed);
      } catch (err) {
        console.error("WS error:", err);
      }
    };
    return () => socket.close();
  }, []);

  if (!config) return null;

  const background = config.pages?.[page]?.background || "";
  const positions = config.pages?.[page]?.positions || {};

  return (
    <div className="viewer-container">
      <div
        className="viewer-inner"
        style={{ backgroundImage: `url(${background})` }}
      >
        {Object.entries(fieldValues).map(([key, value]) => {
          const pos = positions[key] || { x: 0, y: 0 };

          const displayText =
            typeof value === "object"
              ? Object.entries(value)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n")
              : String(value);

          return (
            <div
              key={key}
              className="viewer-field"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                whiteSpace: "pre-line",
              }}
            >
              {displayText}
            </div>
          );
        })}
      </div>
    </div>
  );
}
