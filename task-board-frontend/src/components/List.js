// src/components/List.js
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const List = ({ list, index }) => {
  return (
    <Draggable draggableId={list.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={{
            background: 'lightgrey',
            padding: 8,
            margin: '0 8px',
            borderRadius: 4,
            minWidth: 250,
          }}
        >
          <h3 {...provided.dragHandleProps}>{list.title}</h3>
          <Droppable droppableId={list.id.toString()} type="task">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ minHeight: 100 }}
              >
                {list.Tasks && list.Tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default List;
