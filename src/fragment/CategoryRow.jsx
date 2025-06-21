import Button from './Button';
import './CategoryRow.scss';

export default function CategoryRow({ category, index, onEdit, onSave, onChange, onRemove }) {
  return (
    <div className="category-row">
      {category.isEditing ? (
        <>
          <input
            type="text"
            className="category-input"
            value={category.name}
            onChange={(e) => onChange(index, e.target.value)}
          />
          <Button onClick={() => onSave(index)}>Save</Button>
        </>
      ) : (
        <>
          <span className="category-label">{category.name}</span>
          <Button onClick={() => onEdit(index)}>Edit</Button>
        </>
      )}
      <Button onClick={() => onRemove(index)} className="remove-button">
                ✕
                </Button>
    </div>
  );
}
