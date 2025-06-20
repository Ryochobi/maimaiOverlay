import React, { useRef, useState } from 'react';
import './Control.scss';
import Button from '../fragment/Button';
import FileUpload from '../fragment/FileUpload';
import FieldRow from '../fragment/FieldRow';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';

export default function Control() {
  const [fields, setFields] = useState([
    
    { name: 'round', type: 'text' },
    { name: 'score', type: 'number' },
    { name: 'team', type: 'text' },
  ]);
  const [values, setValues] = useState({});
  let ws = useRef(null);

  const sendUpdate = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(values));
    } else {
      ws.current = new WebSocket('ws://localhost:8080/control');
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify(values));
      };
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(fields, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'control-config.json';
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
  const updatedFields = [...fields];
  updatedFields[index].type = newType;
  if (newType !== 'dropdown') {
    delete updatedFields[index].options;
  }
  setFields(updatedFields);
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
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const importedFields = JSON.parse(evt.target.result);
        setFields(importedFields);
        const initialValues = {};
        importedFields.forEach((field) => {
          initialValues[field.name] = '';
        });
        setValues(initialValues);
      } catch (err) {
        alert('Invalid config file');
      }
    };
    reader.readAsText(file);
  };

  const addField = () => {
    const newFieldName = `field${fields.length + 1}`;
    const newField = { name: newFieldName, type: 'text' };
    setFields([...fields, newField]);
    setValues({ ...values, [newFieldName]: '' });
  };

  return (
    <div className="control-container">
      <div className="control-box side-controls">
          <Button onClick={sendUpdate}>Update Overlay</Button>
          <Button onClick={addField}>Add Field</Button>
          <FileUpload onUpload={handleImport} />
          <Button onClick={handleExport}>Export Config</Button>
        </div>
      <div className="control-box">
        <DragDropContext onDragEnd={(result) => {
  if (!result.destination) return;
  const reordered = Array.from(fields);
  const [moved] = reordered.splice(result.source.index, 1);
  reordered.splice(result.destination.index, 0, moved);
  setFields(reordered);
}}>
  <Droppable droppableId="fields-list">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {fields.map((field, index) => (
          <Draggable key={index} draggableId={`field-${index}`} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <FieldRow
                  field={field}
                  index={index}
                  value={values[field.name]}
                  onNameChange={handleNameChange}
                  onValueChange={handleValueChange}
                  onRemove={handleRemoveField}
                  onTypeChange={handleTypeChange}
                  onOptionsLoad={handleOptionsLoad}
                />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>


      </div>
        
    </div>
  );
}
