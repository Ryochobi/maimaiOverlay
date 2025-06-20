import React from 'react';
import Button from './Button';
import './FieldRow.scss';

export default function FieldRow({
  field,
  index,
  value,
  onNameChange,
  onValueChange,
  onRemove,
  onTypeChange,
  onOptionsLoad,
}) {
  // === Handlers ===

  const handleNameInputChange = (e) => {
    onNameChange(index, e.target.value);
  };

  const handleValueInputChange = (e) => {
    onValueChange(field.name, e.target.value);
  };

  const handleTypeChange = (e) => {
    onTypeChange(index, e.target.value);
  };

  const handleOptionsUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        onOptionsLoad(index, parsed);
      } catch {
        alert('Invalid JSON format for dropdown options.');
      }
    };
    reader.readAsText(file);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  // === Render ===

  return (
    <div className="field-row">
      <input
        type="text"
        className="field-label-input"
        value={field.name}
        onChange={handleNameInputChange}
      />

      <select
        className="field-type-select"
        value={field.type}
        onChange={handleTypeChange}
      >
        <option value="text">text</option>
        <option value="dropdown">dropdown</option>
      </select>

      {field.type === 'dropdown' && field.options ? (
        <select
          className="control-input"
          value={value || ''}
          onChange={handleValueInputChange}
        >
          {Object.entries(field.options).map(([label, payload]) => (
            <option key={label} value={payload}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className="control-input"
          value={value || ''}
          onChange={handleValueInputChange}
        />
      )}

      <div className="field-actions">
  {field.type === 'dropdown' && (
    <label className="dropdown-upload">
      📂
      <input
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleOptionsUpload}
      />
    </label>
  )}
  <Button onClick={handleRemove} className="remove-button">
    ✕
  </Button>
</div>

    </div>
  );
}
