import { useEffect, useState } from "react";
import "./Control.scss";
import Button from "../fragment/Button";
import FieldRow from "../fragment/FieldRow";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CategoryRow from "../fragment/CategoryRow";
import maimaiFields from "../maimaiField.json";
import { useSocket } from "../providers/SocketProvider";

export default function Control() {
  const [fields, setFields] = useState(maimaiFields);
  const [values, setValues] = useState({});
  const socket = useSocket();

useEffect(() => {
  if (socket?.readyState === WebSocket.OPEN) {
    console.log("Socket connected")
  } else {
    console.log("Socket status", socket?.readyState)
  };
}, [socket]);

  const sendUpdate = () => {
    const payload = {
      fields: values,
      // currentSong,
      // song1,
      // song2,
      // song3,
      // song4
    }
    console.log(payload)
    socket.send(JSON.stringify(payload))
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

  const handleValueChange = (name, newValue) => {
    setValues({ ...values, [name]: newValue });
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
