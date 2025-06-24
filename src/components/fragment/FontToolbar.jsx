import React from 'react';
import './FontToolbar.scss';

const FontToolbar = ({ 
  selectedKey, 
  styles, 
  onStyleChange,
  availableFonts = [
    { value: '', label: 'Default' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' }
  ],
  defaultSize = 16
}) => {
  if (!selectedKey) return null;

  const currentStyles = styles[selectedKey] || {};

  const handleChange = (property, value) => {
    onStyleChange(selectedKey, property, value);
  };

  return (
    <div className="font-toolbar">
      <div className="toolbar-section">
        <label className="toolbar-label">
          Font:
          <select
            value={currentStyles.fontFamily || ''}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="toolbar-select"
          >
            {availableFonts.map(font => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">
          Size:
          <input
            type="number"
            value={currentStyles.fontSize ? parseInt(currentStyles.fontSize) : defaultSize}
            onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
            className="toolbar-input"
            min="8"
            max="72"
          />
        </label>
      </div>

      <div className="toolbar-section checkbox-group">
        <label className="toolbar-checkbox">
          <input
            type="checkbox"
            checked={currentStyles.fontWeight === 'bold'}
            onChange={(e) => handleChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
          />
          Bold
        </label>

        <label className="toolbar-checkbox">
          <input
            type="checkbox"
            checked={currentStyles.fontStyle === 'italic'}
            onChange={(e) => handleChange('fontStyle', e.target.checked ? 'italic' : 'normal')}
          />
          Italic
        </label>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">
          Color:
          <input
            type="color"
            value={currentStyles.color || '#000000'}
            onChange={(e) => handleChange('color', e.target.value)}
            className="toolbar-color"
          />
        </label>
      </div>
    </div>
  );
};

export default FontToolbar;