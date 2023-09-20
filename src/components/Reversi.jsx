import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash'; // Asegúrate de importar la biblioteca Lodash si la estás utilizando

const Reversi = ({ boardSize, difficulty }) => {
    const [tamanoTablero, setTamanoTablero] = useState(8);
    const [tablero, setTablero] = useState(inicializarTablero(tamanoTablero));
    const [jugadorActual, setJugadorActual] = useState('X');
    const [contadorJugadorX, setContadorJugadorX] = useState(2);
    const [contadorJugadorO, setContadorJugadorO] = useState(2);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [nivelDificultad, setNivelDificultad] = useState('facil');
    const [sugerenciaActiva, setSugerenciaActiva] = useState(false);
    const [sugerenciaRealizada, setSugerenciaRealizada] = useState(false);
    const [coordenadasSugerencia, setCoordenadasSugerencia] = useState(null);
    const [datosIA, setDatosIA] = useState({
        nodosExplorados: 0,
        tiempoUtilizado: 0,
    });
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        actualizarTablero();
        verificarFinDelJuego();
    }, [tablero, contadorJugadorX, contadorJugadorO]);

    const actualizarTablero = useCallback(() => {
        setMensaje(`Jugador X: ${contadorJugadorX}  Jugador O: ${contadorJugadorO}`);
    }, [contadorJugadorX, contadorJugadorO]);

    const handleBoardSizeChange = (event) => {
        const newSize = parseInt(event.target.value);
        setTablero(inicializarTablero(newSize));
        setTamanoTablero(newSize);
    };

    const verificarFinDelJuego = () => {
        const movimientosPosiblesX = obtenerMovimientosPosibles(tablero, 'X');
        const movimientosPosiblesO = obtenerMovimientosPosibles(tablero, 'O');

        if (movimientosPosiblesX.length === 0 && movimientosPosiblesO.length === 0) {
            setJuegoTerminado(true);
        } else if (movimientosPosiblesX.length === 0) {
            setJugadorActual('O');
        } else if (movimientosPosiblesO.length === 0) {
            setJugadorActual('X');
        }
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
                verificarFinDelJuego();
                setSugerenciaRealizada(false);               
            } else {
                setMensaje("Movimiento inválido. Inténtalo de nuevo");
            }
        }

        if (jugadorActual === 'O') {
            if (obtenerMovimientosPosibles(tablero, 'O').length > 0) {
                handleAIMove();
            } else {
                setJugadorActual('X');
            }
        }
        setSugerenciaActiva(false); 
    };

    const handleAIMove = () => {
        if (nivelDificultad === 'facil') {
            handleAIEasyMove();
        } else if (nivelDificultad === 'medio') {
            handleAIMediumMove();
        } else if (nivelDificultad === 'dificil') {
            handleAIHardMove();
        }
    };

    const handleAIEasyMove = () => {
        const startTime = performance.now();
        const [bestRow, bestCol] = minimax(tablero, 'O', -Infinity, Infinity, 1);
        const endTime = performance.now();

        const tiempoTranscurrido = endTime - startTime;
        setDatosIA((prevDatos) => ({
            nodosExplorados: prevDatos.nodosExplorados + 1,
            tiempoUtilizado: tiempoTranscurrido,
        }));

        if (bestRow !== -1 && bestCol !== -1) {
            const nuevoTableroIA = realizarMovimiento(tablero, bestRow, bestCol, 'O');
            const [nuevoContadorJugadorXIA, nuevoContadorJugadorOIA] = contarFichas(nuevoTableroIA);
            setTablero(nuevoTableroIA);
            setContadorJugadorX(nuevoContadorJugadorXIA);
            setContadorJugadorO(nuevoContadorJugadorOIA);
            setJugadorActual('X');
        }
    };

    const handleAIMediumMove = () => {
        const startTime = performance.now();
        const [bestRow, bestCol] = minimax(tablero, 'O', -Infinity, Infinity, 3);
        const endTime = performance.now();

        const tiempoTranscurrido = endTime - startTime;
        setDatosIA((prevDatos) => ({
            nodosExplorados: prevDatos.nodosExplorados + 1,
            tiempoUtilizado: tiempoTranscurrido,
        }));

        if (bestRow !== -1 && bestCol !== -1) {
            const nuevoTableroIA = realizarMovimiento(tablero, bestRow, bestCol, 'O');
            const [nuevoContadorJugadorXIA, nuevoContadorJugadorOIA] = contarFichas(nuevoTableroIA);
            setTablero(nuevoTableroIA);
            setContadorJugadorX(nuevoContadorJugadorXIA);
            setContadorJugadorO(nuevoContadorJugadorOIA);
            setJugadorActual('X');
        }
    };

    const handleAIHardMove = () => {
        const startTime = performance.now();
        const [bestRow, bestCol] = minimax(tablero, 'O', -Infinity, Infinity, 5);
        const endTime = performance.now();

        const tiempoTranscurrido = endTime - startTime;
        setDatosIA((prevDatos) => ({
            nodosExplorados: prevDatos.nodosExplorados + 1,
            tiempoUtilizado: tiempoTranscurrido,
        }));

        if (bestRow !== -1 && bestCol !== -1) {
            const nuevoTableroIA = realizarMovimiento(tablero, bestRow, bestCol, 'O');
            const [nuevoContadorJugadorXIA, nuevoContadorJugadorOIA] = contarFichas(nuevoTableroIA);
            setTablero(nuevoTableroIA);
            setContadorJugadorX(nuevoContadorJugadorXIA);
            setContadorJugadorO(nuevoContadorJugadorOIA);
            setJugadorActual('X');
        }
    };

    const renderIcon = (casilla) => {
        if (casilla === 'X') {
            return <div className="ficha-blanca"></div>;
        } else if (casilla === 'O') {
            return <div className="ficha-negra"></div>;
        }
        return null; // No se mostrará ningún icono en casillas vacías
    };

    const sugerirJugada = () => {
        // Calcula una jugada sugerida (por ejemplo, una jugada válida al azar)
        const movimientosPosibles = obtenerMovimientosPosibles(tablero, jugadorActual);
        if (movimientosPosibles.length > 0) {
            const [fila, columna] = movimientosPosibles[Math.floor(Math.random() * movimientosPosibles.length)];
            setCoordenadasSugerencia({ fila, columna });
            setSugerenciaActiva(true);
            setSugerenciaRealizada(true);
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
        const nuevoTablero = _.cloneDeep(tablero);

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
            return false;
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
                return true;
            }
        }

        return false;
    }

    function obtenerMovimientoAleatorio(tablero, jugador) {
        const movimientosPosibles = [];
        for (let fila = 0; fila < tablero.length; fila++) {
            for (let columna = 0; columna < tablero[0].length; columna++) {
                if (esMovimientoValido(tablero, fila, columna, jugador)) {
                    movimientosPosibles.push([fila, columna]);
                }
            }
        }
        if (movimientosPosibles.length === 0) {
            return [-1, -1];
        }
        const indiceAleatorio = Math.floor(Math.random() * movimientosPosibles.length);
        return movimientosPosibles[indiceAleatorio];
    }

    function minimax(tablero, jugador, alpha, beta, profundidad) {
        if (profundidad === 0 || !hayMovimientosPosibles(tablero, jugador)) {
            const [, score] = evaluarTablero(tablero);
            return [-1, -1, score];
        }

        const movimientosPosibles = obtenerMovimientosPosibles(tablero, jugador);
        let bestRow = -1;
        let bestCol = -1;

        if (jugador === 'O') {
            let maxScore = -Infinity;
            for (const [row, col] of movimientosPosibles) {
                const nuevoTablero = realizarMovimiento(tablero, row, col, jugador);
                const [, score] = minimax(nuevoTablero, 'X', alpha, beta, profundidad - 1);
                if (score > maxScore) {
                    maxScore = score;
                    bestRow = row;
                    bestCol = col;
                }
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
            return [bestRow, bestCol, maxScore];
        } else {
            let minScore = Infinity;
            for (const [row, col] of movimientosPosibles) {
                const nuevoTablero = realizarMovimiento(tablero, row, col, jugador);
                const [, score] = minimax(nuevoTablero, 'O', alpha, beta, profundidad - 1);
                if (score < minScore) {
                    minScore = score;
                    bestRow = row;
                    bestCol = col;
                }
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
            return [bestRow, bestCol, minScore];
        }
    }

    function evaluarTablero(tablero) {
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

        const puntuacion = fichasX - fichasO;
        return [fichasX, fichasO, puntuacion];
    }

    function hayMovimientosPosibles(tablero, jugador) {
        for (let fila = 0; fila < tablero.length; fila++) {
            for (let columna = 0; columna < tablero[0].length; columna++) {
                if (esMovimientoValido(tablero, fila, columna, jugador)) {
                    return true;
                }
            }
        }
        return false;
    }

    function obtenerMovimientosPosibles(tablero, jugador) {
        const movimientosPosibles = [];
        for (let fila = 0; fila < tablero.length; fila++) {
            for (let columna = 0; columna < tablero[0].length; columna++) {
                if (esMovimientoValido(tablero, fila, columna, jugador)) {
                    movimientosPosibles.push([fila, columna]);
                }
            }
        }
        return movimientosPosibles;
    }

    function obtenerResultado() {
        const [fichasX, fichasO] = contarFichas(tablero);
    
        if (fichasX > fichasO) {
            return 'Jugador Blanco gana';
        } else if (fichasO > fichasX) {
            return 'Jugador Negro gana';
        } else {
            return 'Empate';
        }
    }

    return (
        <div className="game-container">
            <h1>Reversi</h1>
            <label htmlFor="boardSize">Tamaño del Tablero:</label>
            <select id="boardSize" onChange={handleBoardSizeChange} value={tamanoTablero}>
                <option value={6}>6x6</option>
                <option value={8}>8x8</option>
            </select>
            <label htmlFor="difficulty">Nivel de Dificultad:</label>
            <select id="difficulty" onChange={(e) => setNivelDificultad(e.target.value)} value={nivelDificultad}>
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="dificil">Difícil</option>
            </select>
            <button onClick={sugerirJugada}>Sugerir Jugada</button>

                <div className={`tablero ${tamanoTablero === 6 ? 'tablero-6x6' : 'tablero-8x8'}`} id="tablero">
                    {tablero.map((fila, rowIndex) => (
                        fila.map((casilla, columnIndex) => (
                            <div
                                key={`${rowIndex}-${columnIndex}`}
                                className={`casilla ${casilla} ${coordenadasSugerencia && coordenadasSugerencia.fila === rowIndex && coordenadasSugerencia.columna === columnIndex ? 'sugerencia' : ''}`}
                                data-fila={rowIndex}
                                data-columna={columnIndex}
                                onClick={() => handleCasillaClick(rowIndex, columnIndex)}
                            >
                                {renderIcon(casilla)}
                            </div>
                        ))
                    ))}
                </div>

            <p id="mensaje">
                Nodos explorados: {datosIA.nodosExplorados}, Tiempo utilizado: {datosIA.tiempoUtilizado.toFixed(2)} ms               
            </p>
            {juegoTerminado && (
                <p id="mensaje">¡Juego terminado! Resultado: {obtenerResultado()}</p>
            )}
        </div>
    );
};

export default Reversi;