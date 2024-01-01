/// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/login';
import HomePage from './components/HomePage';
import TaskBoard from './components/TaskBoard';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Check if the user is already logged in by making a request to the backend
      try {
        const response = await axios.get('http://localhost:3001/api/auth/login');
        if (response.data.loggedIn) {
          setLoggedIn(true);
          setUsername(response.data.username);
          // Fetch lists if the user is logged in
          fetchLists();
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    // Perform login logic here
    // ...

    // After successful login, set loggedIn to true, fetch lists, and set the username
    setLoggedIn(true);
    setUsername(/* Get the username from the login response */);
    fetchLists();
  };

  const handleLogout = async () => {
    // Perform logout logic here
    // ...

    // After successful logout, set loggedIn to false, clear the username, and clear lists
    setLoggedIn(false);
    setUsername('');
    setLists([]);
  };

  const fetchLists = async () => {
    try {
      const response = await axios.get('/lists');
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      {loading ? (
        <p>Loading...</p>
      ) : !loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <HomePage username={username} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
