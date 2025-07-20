import SongField from "./SongField";
import "./FieldRow.scss";
import RandomizerField from "./RandomizerField";

export default function FieldRow({
  field,
  index,
  value,
  onNameChange,
  onValueChange,
  onTypeChange,
}) {
  const handleNameInputChange = (e) => {
    onNameChange(index, e.target.value);
  };

  const handleValueInputChange = (e) => {
    onValueChange(field.name, e.target.value);
  };

  const handleTypeChange = (e) => {
    onTypeChange(index, e.target.value);
  };

  return (
    <div className="field-row">
      <input
        type="text"
        className="field-label-input"
        value={field.name}
        onChange={handleNameInputChange}
        disabled
      />

      <select
        className="field-type-select"
        value={field.fieldType}
        onChange={handleTypeChange}
        disabled
      >
        <option value="text">text</option>
        <option value="song">song</option>
        <option value="randomizer">randomizer</option>
      </select>

      {field.fieldType === "song" ? (
        <SongField onValueChange={handleValueInputChange} field={field}/>
      ) : field.fieldType === "randomizer" ? (
        <RandomizerField onValueChange={handleValueInputChange} field={field}/>
      ) : (
        <input
          type="text"
          className="control-input"
          value={value || ""}
          onChange={handleValueInputChange}
        />
      )}
    </div>
  );
}
