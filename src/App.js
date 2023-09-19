import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import _ from 'lodash';
import Reversi from './components/Reversi';
import Menu from './components/Menu';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [boardSize, setBoardSize] = useState(6);
  const [difficulty, setDifficulty] = useState('facil');

  const handleStartGame = (size, level) => {
    setBoardSize(size);
    setDifficulty(level);
    setGameStarted(true);
  }

  return (
      <div className="App">
        {gameStarted ? (
            // Renderiza el componente Reversi si gameStarted es true
            <Reversi boardSize={boardSize} difficulty={difficulty} />
        ) : (
            // Renderiza el menÃº si gameStarted es false
            <Menu onStartGame={handleStartGame} />
        )}
      </div>
  );
}

export default App;