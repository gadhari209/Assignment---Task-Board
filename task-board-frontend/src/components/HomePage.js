import React, { useState, useEffect, useRef } from 'react';
import TaskBoard from './TaskBoard';
import AddList from './AddList';

const HomePage = ({ onLogout }) => {
  const [taskBoardHeight, setTaskBoardHeight] = useState(0);
  const taskBoardRef = useRef(null);

  useEffect(() => {
    // Calculate and set the height of the TaskBoard
    if (taskBoardRef.current) {
      const height = taskBoardRef.current.clientHeight;
      setTaskBoardHeight(height);
    }
  }, []);

  const handleRefresh = () => {
    // Force a re-render of the TaskBoard component by changing its key
    setTaskBoardHeight(0); // Reset the height to trigger re-render
  };

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem('user'));

  // Extract username from user data
  const username = userData ? userData.username : '';

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      background: '#f0f2f5', // Facebook background color
      minHeight: '100vh',
      color: '#1c1e21', // Facebook text color
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    nav: {
      background: '#4267B2', // Facebook blue color
      color: '#fff',
      width: '100%',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    welcome: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    buttons: {
      display: 'flex',
      gap: '10px',
    },
    refreshButton: {
      padding: '8px 16px',
      background: '#1877f2', // Facebook lighter blue color
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      ':hover': {
        background: '#0e5a8a', // Darker shade on hover
      },
    },
    logoutButton: {
      padding: '8px 16px',
      background: '#f02849', // Facebook red color
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      ':hover': {
        background: '#d21f3c', // Darker shade on hover
      },
    },
    contentWrapper: {
      width: '80%',
      maxWidth: '1200px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    firstRow: {
      display: 'flex',
      gap: '20px',
    },
    taskBoard: {
      flex: 2,
      overflowX: 'auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: '#fff',
    },
    addList: {
      flex: 1,
      height: taskBoardHeight,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: '#fff',
    },
    secondRow: {
      display: 'flex',
      gap: '20px',
    },
    firstColumn: {
      flex: 2 / 3,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: '#fff',
    },
    secondColumn: {
      flex: 1 / 3,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: '#fff',
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.welcome}>
          Welcome, {username}!
        </div>
        <div style={styles.buttons}>
          <button style={styles.refreshButton} onClick={handleRefresh}>
            Refresh
          </button>
          <button style={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div style={styles.contentWrapper}>
        {/* First row (2 columns) */}
        <div style={styles.firstRow}>
          {/* TaskBoard column */}
          <div ref={taskBoardRef} style={styles.taskBoard}>
            <h2 style={{ color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>Task Board</h2>
            <TaskBoard key={taskBoardHeight} />
          </div>
          {/* AddList column */}
          <div style={styles.addList}>
            <h2 style={{ color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>Add List</h2>
            <AddList />
          </div>
        </div>
        {/* Second row (2/3 + 1/3) */}
        <div style={styles.secondRow}>
          {/* First column (2/3) */}
          <div style={styles.firstColumn}>
            {/* Your content for the first column */}
          </div>
          {/* Second column (1/3) */}
          <div style={styles.secondColumn}>
            {/* Your content for the second column */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
