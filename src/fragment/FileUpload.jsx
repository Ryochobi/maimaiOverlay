import React, { useRef } from 'react';
import './Button.scss';
import "../components/Control.scss"


export default function FileUpload({ onUpload, label }) {
  const fileInputRef = useRef();
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!file) return;
      try {
        const config = JSON.parse(event.target.result);
        onUpload(config);
      } catch (err) {
        console.error('Invalid JSON file:', err);
        alert('Invalid config file. Please upload a valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <button onClick={handleClick} className="control-upload">{label || 'Upload Config'}</button>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
