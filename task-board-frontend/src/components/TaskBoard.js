import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskBoard = () => {
  const [lists, setLists] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/lists/user/1/lists');
        setLists(response.data.Lists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const onBeforeDragEnd = () => {
    // You can add a loading indicator or any visual feedback before the drag ends
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    onBeforeDragEnd(); // Add any loading indicator or visual feedback

    if (!destination) return;

    if (source.droppableId !== destination.droppableId || source.index !== destination.index) {
      const updatedLists = [...lists];
      const sourceList = updatedLists.find((list) => list.id === parseInt(source.droppableId));
      const destinationList = updatedLists.find((list) => list.id === parseInt(destination.droppableId));

      const movedTask = sourceList.Tasks.find((task) => task.id === parseInt(draggableId));
      movedTask.ListId = parseInt(destinationList.id);

      // Update the task in the database
      await axios.put(`http://localhost:3001/api/lists/tasks/${draggableId}/move`, { ListId: movedTask.ListId });

      // Update the state to reflect the changes
      setLists(updatedLists);
    }
  };

  const handleTaskCheckboxChange = async (taskId) => {
    try {
      // Toggle the completed status of the task
      const updatedLists = lists.map((list) => ({
        ...list,
        Tasks: list.Tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }));

      setLists(updatedLists);

      // Make API call to update the task's completion status
      await axios.put(`http://localhost:3001/api/lists/tasks/${taskId}/toggle-completion`);
    } catch (error) {
      console.error('Error updating task completion status:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      // Make API call to delete the task
      await axios.delete(`http://localhost:3001/api/lists/tasks/${taskId}`);

      // Fetch updated data after deletion
      const response = await axios.get('http://localhost:3001/api/lists/user/1/lists');
      setLists(response.data.Lists);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddTask = async (listId) => {
    try {
      if (!newTaskDescription) {
        return; // Do not add empty tasks
      }

      const response = await axios.post(`http://localhost:3001/api/lists/${listId}/tasks`, {
        description: newTaskDescription,
        status: 'pending', // You can set the default status
      });

      const updatedLists = lists.map((list) =>
        list.id === listId ? { ...list, Tasks: [...list.Tasks, response.data.newTask] } : list
      );

      setLists(updatedLists);
      setNewTaskDescription(''); // Clear the input field
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      overflowX: 'auto',
    },
    list: {
      margin: '8px',
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      minWidth: '250px', // Adjusted minimum width
      width: 'max-content',
      backgroundColor: '#f0f2f5', // Facebook background color
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      marginBottom: '8px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#385898', // Facebook blue color
    },
    task: {
      margin: '4px',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
    },
    taskText: {
      marginLeft: '8px',
      flex: 1,
      textDecoration: 'none',
      color: '#385898', // Facebook blue color
    },
    checkbox: {
      marginLeft: '8px',
    },
    addButtonWrapper: {
      display: 'flex',
      marginTop: '8px',
    },
    // Adjusted styles for the "Add Task" input and button
    addTaskInput: {
      flex: '1',
      marginRight: '8px',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '14px', // Adjusted font size
      maxWidth: '150px', // Adjusted maximum width
    },
    addButton: {
      padding: '8px 12px', // Adjusted padding
      background: '#385898', // Facebook blue color
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.3s ease',
      fontSize: '14px', // Adjusted font size
      maxWidth: '80px', // Adjusted maximum width
      whiteSpace: 'nowrap', // Prevent button text from wrapping
      overflow: 'hidden', // Hide overflow text
      textOverflow: 'ellipsis', // Add ellipsis (...) for overflow text
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      ':hover': {
        background: '#2d4e8e', // Darker shade on hover
      },
    },
  };

  return (
    <DragDropContext onBeforeDragEnd={onBeforeDragEnd} onDragEnd={onDragEnd}>
      <div style={styles.container}>
        {lists.map((list) => (
          <Droppable key={list.id} droppableId={list.id.toString()} direction="vertical" type="task">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={styles.list}>
                <h3 style={styles.title}>{list.title}</h3>
                <ul>
                  {list.Tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={styles.task}
                        >
                          <button onClick={() => handleTaskDelete(task.id)} style={styles.checkbox}>
                            Mark Done
                          </button>
                          <span style={{ ...styles.taskText, textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.description}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </ul>
                <div style={styles.addButtonWrapper}>
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="New Task"
                    style={styles.addTaskInput}
                  />
                  <button onClick={() => handleAddTask(list.id)} style={styles.addButton}>
                    Add 
                  </button>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
