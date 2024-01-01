import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddList = ({ onAddList }) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Retrieve user ID from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { userId } = JSON.parse(storedUser);
      setUserId(userId);
    }
  }, []);

  const handleAddList = async () => {
    try {
      if (newListTitle && userId) {
        // Make API call to add a new list with the user ID
        await axios.post('http://localhost:3001/api/lists/lists', { title: newListTitle, userId });

        // Notify the parent component about the new list
        onAddList();

        // Clear the input field
        setNewListTitle('');
      }
    } catch (error) {
      console.error('Error adding a new list:', error);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px', // Added margin-bottom
    },
    input: {
      marginRight: '8px',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '14px',
      flex: '1',
    },
    addButton: {
      padding: '8px',
      borderRadius: '4px',
      border: 'none',
      background: '#385898', // Facebook blue color
      color: '#fff',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Enter list title"
        value={newListTitle}
        onChange={(e) => setNewListTitle(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleAddList} style={styles.addButton}>
        Add New List
      </button>
    </div>
  );
};

export default AddList;

