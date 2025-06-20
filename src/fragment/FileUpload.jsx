import React from 'react';
import './Button.scss';

export default function FileUpload({ onUpload }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <label className="control-upload">
      Import Config
      <input
        type="file"
        accept=".json"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </label>
  );
}
