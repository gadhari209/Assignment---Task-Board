import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { userId, password });

      // Assuming your backend sends a user object with userId and other details
      const user = response.data;

      // Store the user object in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Call onLogin callback to update the state in the parent component
      onLogin();
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <nav style={styles.nav}>
        <h1 style={styles.navHeading}>Welcome to Task Board Assignment</h1>
      </nav>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login</h2>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        {error && <p style={{ color: '#FF4500', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  nav: {
    background: '#1877f2',
    padding: '10px',
    textAlign: 'center',
  },
  navHeading: {
    color: '#fff',
    margin: '0',
  },
  container: {
    width: '300px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    background: '#fff',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#1877f2', // Facebook blue color
  },
  inputContainer: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    background: '#1877f2', // Facebook blue color
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Login;
