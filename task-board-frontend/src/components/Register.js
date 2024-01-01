import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return;
      }

      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        password,
      });

      // Assuming your backend sends a user object with userId and other details
      const user = response.data;

      // Store the user object in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Display SweetAlert with user information
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        html: `User ID: ${user.userId}<br/>Username: ${user.username}`,
      });

      // Call onRegister callback to update the state in the parent component
      onRegister(user.userId); // Pass the user ID to the parent component
    } catch (err) {
      setError('Error registering user. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <button onClick={handleRegister} style={styles.button}>
        Register
      </button>
      {error && <p style={{ color: '#FF4500', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

const styles = {
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

export default Register;
