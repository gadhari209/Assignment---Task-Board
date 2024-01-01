// src/components/Task.js
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            background: 'white',
            padding: 8,
            margin: '8px 0',
            borderRadius: 4,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {task.description}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
