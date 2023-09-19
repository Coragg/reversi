import React, { useState } from 'react';

const Menu = ({ onStartGame }) => {
    const [boardSize, setBoardSize] = useState(6);
    const [difficulty, setDifficulty] = useState('facil');

    const handleStartClick = () => {
        onStartGame(boardSize, difficulty);
    };

    return (
        <div className="menu">
            <h1 className="menu-title">Reversi</h1>
            <div className="menu-options">
                <div className="menu-option">
                    <label htmlFor="boardSize">Tamaño del Tablero:</label>
                    <select
                        id="boardSize"
                        onChange={(e) => setBoardSize(parseInt(e.target.value))}
                        value={boardSize}
                    >
                        <option value={6}>6x6</option>
                        <option value={8}>8x8</option>
                    </select>
                </div>
                <div className="menu-option">
                    <label htmlFor="difficulty">Nivel de Dificultad:</label>
                    <select
                        id="difficulty"
                        onChange={(e) => setDifficulty(e.target.value)}
                        value={difficulty}
                    >
                        <option value="facil">Fácil</option>
                        <option value="medio">Medio</option>
                        <option value="dificil">Difícil</option>
                    </select>
                </div>
            </div>
            <button className="menu-button" onClick={handleStartClick}>
                Iniciar Juego
            </button>
        </div>
    );
};

export default Menu;