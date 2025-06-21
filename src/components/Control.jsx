import React, { useRef, useState } from "react";
import "./Control.scss";
import Button from "../fragment/Button";
import FileUpload from "../fragment/FileUpload";
import FieldRow from "../fragment/FieldRow";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CategoryRow from "../fragment/CategoryRow";

export default function Control() {
  const [fields, setFields] = useState([
  {
    type: "category",
    name: "Team A",
    isEditing: false
  },
  {
    type: "field",
    name: "Player 1",
    fieldType: "text", // "text" or "dropdown"
    value: "",
  },
  {
    type: "field",
    name: "Character",
    fieldType: "dropdown",
    value: "",
    options: {
      "Mario": "mario",
      "Luigi": "luigi",
      "Peach": "peach"
    }
  },
  {
    type: "category",
    name: "Team B",
    isEditing: false
  },
  {
    type: "field",
    name: "Player 2",
    fieldType: "text",
    value: ""
  }
]);
  const [values, setValues] = useState({});
  let ws = useRef(null);

  const sendUpdate = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(values));
    } else {
      ws.current = new WebSocket("ws://localhost:8080/control");
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify(values));
      };
    }
  };

  const handleExport = () => {
    const config = { fields }; // wrap as object
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "control-config.json";
    link.click();
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

  const handleImport = (e) => {
    const importedFields = e.fields;
    try {
      setFields(importedFields);
    } catch (err) {
      alert("Invalid config file");
    }
  };

const addField = () => {
  setFields([
    ...fields,
    {
      type: 'field',       // stays 'field'
      name: `Field ${fields.length + 1}`,
      fieldType: 'text',   // editable by dropdown
      value: ''
    }
  ]);
};


  const addCategory = () => {
    setFields([
      ...fields,
      { type: "category", name: "New Category", isEditing: false },
    ]);
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
        <Button onClick={sendUpdate}>Update Overlay</Button>
        <Button onClick={addCategory}>Add Category</Button>
        <Button onClick={addField}>Add Field</Button>
        <FileUpload onUpload={handleImport} />
        <Button onClick={handleExport}>Export Config</Button>
      </div>
      <div className="control-box">
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
