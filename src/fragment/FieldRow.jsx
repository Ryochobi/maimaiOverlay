import Button from "./Button";
import "./FieldRow.scss";

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
  const handleNameInputChange = (e) => {
    onNameChange(index, e.target.value);
  };

  const handleValueInputChange = (e) => {
    const selectedId = e.target.value;
    onValueChange(field.name, selectedId); // fallback if no `values`
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
        alert("Invalid JSON format for dropdown options.");
      }
    };
    reader.readAsText(file);
  };

  const handleRemove = () => {
    onRemove(index);
  };

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
        value={field.fieldType}
        onChange={handleTypeChange}
      >
        <option value="text">text</option>
        <option value="dropdown">dropdown</option>
      </select>

      {field.fieldType === "dropdown" ? (
        <select
          className="control-input"
          value={value || ""}
          onChange={handleValueInputChange}
        >
            <option value="">Select...</option>
          {field.options && field.options.length > 0 ? (
            field.options.map((f, i) => {
              // Logic is used mainly for maimai title - difficulty - type concatenation
              const label = f.values
                ? `${f.values.title} - ${
                    f.values.difficulty?.toUpperCase() || ""
                  } - ${f.values.type?.toUpperCase() || ""}`
                : f.id;
              return (
                <option key={i} value={f.id}>
                  {label}
                </option>
              );
            })
          ) : (
            <option value="">No options loaded</option>
          )}
        </select>
      ) : (
        <input
          type="text"
          className="control-input"
          value={value || ""}
          onChange={handleValueInputChange}
        />
      )}

      <div className="field-actions">
        {field.fieldType === "dropdown" && (
          <label className="dropdown-upload">
            📂
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
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
