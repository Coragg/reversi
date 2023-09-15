import React, { useState, useEffect } from 'react';
import './App.css';

const Reversi = () => {
  const [tamanoTablero, setTamanoTablero] = useState(6);
  const [tablero, setTablero] = useState(inicializarTablero(tamanoTablero));
  const [jugadorActual, setJugadorActual] = useState('X');
  const [contadorJugadorX, setContadorJugadorX] = useState(2);
  const [contadorJugadorO, setContadorJugadorO] = useState(2);

  const actualizarTablero = () => {
    const tableroElement = document.getElementById("tablero");
    const mensajeElement = document.getElementById("mensaje");

    for (let fila = 0; fila < tamanoTablero; fila++) {
      for (let columna = 0; columna < tamanoTablero; columna++) {
        const casilla = tableroElement.querySelector(`[data-fila="${fila}"][data-columna="${columna}"]`);
        casilla.textContent = tablero[fila][columna];
      }
    }
    mensajeElement.textContent = `Jugador X: ${contadorJugadorX}  Jugador O: ${contadorJugadorO}`;
  };

  // Inicializa el tablero visual
  useEffect(() => {
    actualizarTablero();
  });

  // Función para actualizar el tablero visualmente

  const handleBoardSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setTablero(inicializarTablero(newSize));
    setTamanoTablero(newSize);
  };

  const handleCasillaClick = (fila, columna) => {
    if (jugadorActual === 'X') {
      if (esMovimientoValido(tablero, fila, columna, jugadorActual)) {
        const nuevoTablero = realizarMovimiento(tablero, fila, columna, jugadorActual);
        const [nuevoContadorJugadorX, nuevoContadorJugadorO] = contarFichas(nuevoTablero);
        setTablero(nuevoTablero);
        setContadorJugadorX(nuevoContadorJugadorX);
        setContadorJugadorO(nuevoContadorJugadorO);
        setJugadorActual('O');
      } else {
        // Puedes mostrar un mensaje de movimiento inválido aquí.
        // mensajeElement.textContent = "Movimiento inválido. Inténtalo de nuevo.";
      }
    }

    // Move AI's turn logic here.
    if (jugadorActual === 'O') {
      const [filaIA, columnaIA] = movimientoIA(tablero, 'O');
      if (filaIA !== -1 && columnaIA !== -1) {
        const nuevoTableroIA = realizarMovimiento(tablero, filaIA, columnaIA, 'O');
        const [nuevoContadorJugadorXIA, nuevoContadorJugadorOIA] = contarFichas(nuevoTableroIA);
        setTablero(nuevoTableroIA);
        setContadorJugadorX(nuevoContadorJugadorXIA);
        setContadorJugadorO(nuevoContadorJugadorOIA);
        setJugadorActual('X'); // Cambio de nuevo al jugador X
      } else {
        // Puedes mostrar un mensaje de que la IA no puede realizar movimientos aquí.
        // mensajeElement.textContent = "La IA no puede realizar movimientos. Turno de X.";
        setJugadorActual('X'); // Cambio de nuevo al jugador X
      }
    }
  };

  function inicializarTablero(tamano) {
    let tablero = new Array(tamano);
    for (let i = 0; i < tamano; i++) {
      tablero[i] = new Array(tamano).fill(' ');
    }
    let centro = Math.floor(tamano / 2);
    tablero[centro - 1][centro - 1] = 'O';
    tablero[centro - 1][centro] = 'X';
    tablero[centro][centro - 1] = 'X';
    tablero[centro][centro] = 'O';
    return tablero;
  }

  function realizarMovimiento(tablero, fila, columna, jugador) {
    const nuevoTablero = JSON.parse(JSON.stringify(tablero)); // Copia el tablero para no modificar el original.

    const direcciones = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    nuevoTablero[fila][columna] = jugador;

    for (const [dr, dc] of direcciones) {
      let r = fila + dr;
      let c = columna + dc;
      let fichasAReemplazar = [];

      while (r >= 0 && r < tablero.length && c >= 0 && c < tablero[0].length) {
        if (tablero[r][c] === ' ' || tablero[r][c] === jugador) {
          break;
        }
        fichasAReemplazar.push([r, c]);
        r += dr;
        c += dc;
      }

      if (
        r >= 0 &&
        r < tablero.length &&
        c >= 0 &&
        c < tablero[0].length &&
        tablero[r][c] === jugador &&
        fichasAReemplazar.length > 0
      ) {
        for (const [rf, cf] of fichasAReemplazar) {
          nuevoTablero[rf][cf] = jugador;
        }
      }
    }

    return nuevoTablero;
  }

  function contarFichas(tablero) {
    let fichasX = 0;
    let fichasO = 0;

    for (const fila of tablero) {
      for (const casilla of fila) {
        if (casilla === 'X') {
          fichasX++;
        } else if (casilla === 'O') {
          fichasO++;
        }
      }
    }

    return [fichasX, fichasO];
  }

  function esMovimientoValido(tablero, fila, columna, jugador) {
    if (tablero[fila][columna] !== ' ') {
      return false; // La casilla ya está ocupada.
    }

    const direcciones = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dr, dc] of direcciones) {
      let r = fila + dr;
      let c = columna + dc;
      let fichasAReemplazar = [];

      while (r >= 0 && r < tablero.length && c >= 0 && c < tablero[0].length) {
        if (tablero[r][c] === ' ' || tablero[r][c] === jugador) {
          break;
        }
        fichasAReemplazar.push([r, c]);
        r += dr;
        c += dc;
      }

      if (
        r >= 0 &&
        r < tablero.length &&
        c >= 0 &&
        c < tablero[0].length &&
        tablero[r][c] === jugador &&
        fichasAReemplazar.length > 0
      ) {
        // El movimiento es válido.
        return true;
      }
    }

    return false;
  }

  function movimientoIA(tablero, jugador) {
    for (let fila = 0; fila < tablero.length; fila++) {
      for (let columna = 0; columna < tablero[0].length; columna++) {
        if (esMovimientoValido(tablero, fila, columna, jugador)) {
          return [fila, columna]; // Devuelve el primer movimiento válido encontrado.
        }
      }
    }
    return [-1, -1]; // Si no hay movimientos válidos, devuelve [-1, -1].
  }

  return (
    <div>
      <h1>Reversi</h1>
      <label htmlFor="boardSize">Tamaño del Tablero:</label>
      <select id="boardSize" onChange={handleBoardSizeChange} value={tamanoTablero}>
        <option value={6}>6x6</option>
        <option value={8}>8x8</option>
      </select>
      {/* Utiliza clases condicionales para aplicar los estilos según el tamaño del tablero */}
      <div className={`tablero ${tamanoTablero === 6 ? 'tablero-6x6' : 'tablero-8x8'}`} id="tablero">
        {tablero.map((fila, rowIndex) => (
          fila.map((casilla, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={`casilla ${casilla}`}
              data-fila={rowIndex}
              data-columna={columnIndex}
              onClick={() => handleCasillaClick(rowIndex, columnIndex)}
            >
              {casilla}
            </div>
          ))
        ))}
      </div>
      <p id="mensaje"></p>
    </div>
  );
};

export default Reversi;
