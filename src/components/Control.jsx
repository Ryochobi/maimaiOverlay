import { useState } from "react";
import "./Control.scss";
import Button from "../fragment/Button";
import FieldRow from "../fragment/FieldRow";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CategoryRow from "../fragment/CategoryRow";
import { useSelector } from "react-redux";
import maimaiFields from "../maimaiField.json";
import config from "../config";

export default function Control() {
  const currentSong = useSelector((state) => state.songs.currentSong);
  const song1 = useSelector((state) => state.songs.song1);
  const song2 = useSelector((state) => state.songs.song2);
  const song3 = useSelector((state) => state.songs.song3);
  const song4 = useSelector((state) => state.songs.song4);


  const [fields, setFields] = useState(maimaiFields);
  const [values, setValues] = useState({});
  const ws = new WebSocket(config.websocketUrl);

  const sendUpdate = () => {
    console.log(values)
    console.log(currentSong, song1, song2, song3, song4)
    const payload = {
      fields: values,
      currentSong,
      song1,
      song2,
      song3,
      song4
    }
    console.log(payload)
    ws.send(JSON.stringify(payload))
  };

  const handleNameChange = (index, newName) => {
    const updatedFields = [...fields];
    const oldName = updatedFields[index].name;
    updatedFields[index].name = newName;

    const updatedValues = { ...values };
    if (oldName !== newName) {
      updatedValues[newName] = updatedValues[oldName];
      delete updatedValues[oldName];
    }
    setFields(updatedFields);
    setValues(updatedValues);
  };

  const handleTypeChange = (index, newType) => {
    const updated = [...fields];
    updated[index].fieldType = newType;
    setFields(updated);
  };

  const handleOptionsLoad = (index, options) => {
    const updatedFields = [...fields];
    updatedFields[index].options = options;
    setFields(updatedFields);
  };

  const handleValueChange = (name, newValue) => {
    setValues({ ...values, [name]: newValue });
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    const updatedValues = { ...values };
    delete updatedValues[fields[index].name];
    setFields(updatedFields);
    setValues(updatedValues);
  };

  const toggleEditCategory = (index) => {
    const updated = [...fields];
    updated[index].isEditing = true;
    setFields(updated);
  };

  const saveCategoryName = (index) => {
    const updated = [...fields];
    updated[index].isEditing = false;
    setFields(updated);
  };

  const updateCategoryName = (index, newName) => {
    const updated = [...fields];
    updated[index].name = newName;
    setFields(updated);
  };

  const handleRemoveCategory = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  return (
    <div className="control-container">
      <div className="control-box side-controls">
        <span className="header-label">Controls</span>
        <Button onClick={sendUpdate}>Update Overlay</Button>
      </div>
      <div className="control-box">
        <span className="header-label">Fields</span>
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            const reordered = Array.from(fields);
            const [moved] = reordered.splice(result.source.index, 1);
            reordered.splice(result.destination.index, 0, moved);
            setFields(reordered);
          }}
        >
          <Droppable droppableId="fields-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field, index) => {
                  return (
                    <Draggable
                      key={index}
                      draggableId={`field-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {field.type === "field" ? (
                            <FieldRow
                              field={field}
                              index={index}
                              value={values[field.name] || ""}
                              onNameChange={handleNameChange}
                              onValueChange={handleValueChange}
                              onRemove={handleRemoveField}
                              onTypeChange={handleTypeChange}
                              onOptionsLoad={handleOptionsLoad}
                            />
                          ) : field.type === "category" ? (
                            <CategoryRow
                              category={field}
                              index={index}
                              onEdit={toggleEditCategory}
                              onSave={saveCategoryName}
                              onChange={updateCategoryName}
                              onRemove={handleRemoveCategory}
                            />
                          ) : null}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
