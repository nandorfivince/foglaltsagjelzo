import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

// Címe a backend szervernek
const ENDPOINT = window.location.hostname === 'localhost' 
  ? "http://localhost:3000" 
  : window.location.origin.replace(/^http/, 'ws');


function App() {
  const [buttonState, setButtonState] = useState('Szabad');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('stateChange', (state) => {
      setButtonState(state);
    });

    return () => socket.disconnect();
  }, []);

  const handleClick = () => {
    const newState = buttonState === 'Szabad' ? 'Foglalt' : 'Szabad';
    setButtonState(newState);
    socketIOClient(ENDPOINT).emit('changeState', newState);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20%', backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <button
        onClick={handleClick}
        style={{ padding: '10px 20px', fontSize: '20px', color: 'white', backgroundColor: buttonState === 'Szabad' ? 'green' : 'red' }}
      >
        {buttonState}
      </button>
    </div>
  );
}

export default App;
