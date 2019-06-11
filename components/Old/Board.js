import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { parseCookies } from 'nookies';
import BoardPiece from './BoardPiece';

const calculateWhoseTurn = match => {
  const blackMovesSum = match.black.pieces.reduce(
    (accumulator, piece) => accumulator + piece.columnHistory.length,
    0
  );

  const whiteMovesSum = match.white.pieces.reduce(
    (accumulator, piece) => accumulator + piece.columnHistory.length,
    0
  );

  const whiteCanMove = whiteMovesSum === blackMovesSum;

  return whiteCanMove ? 'white' : 'black';
};

const getOpponentPiecesColor = playerPiecesColor =>
  playerPiecesColor === 'white' ? 'black' : 'white';

const matchReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_MATCH':
      return { ...action.payload };
    case 'MOVE_PIECE':
      // find piece and update piece
      return { ...state };
    case 'END_GAME':
      delete state.endedAt;
      return { ...state, endedAt: true };
    default:
      throw new Error('Unexpected action');
  }
};

const Board = props => {
  const { match: matchData, user: authenticatedUser } = props;
  const { token } = parseCookies(props);
  const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  const defaultRows = [8, 7, 6, 5, 4, 3, 2, 1];

  const [match, setMatch] = useReducer(matchReducer, matchData);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [rows, setRows] = useState(defaultRows);
  const [whoseTurn, setWhoseTurn] = useState(() => calculateWhoseTurn(match));
  const [playerPiecesColor, setPlayerPiecesColor] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [opponentIsReady, setOpponentIsReady] = useState(false);

  console.log('RE RENDER');
  useEffect(() => {
    if (authenticatedUser) {
      const authenticatedUserColor =
        match.white.user === authenticatedUser._id ? 'white' : 'black';
      setPlayerPiecesColor(authenticatedUserColor);
      if (authenticatedUserColor === 'black') {
        setRows(rows.reverse());
      }

      if (match[getOpponentPiecesColor(authenticatedUserColor)].readyAt) {
        setOpponentIsReady(true);
      } else {
        setOpponentIsReady(false);
      }

      setLoading(false);

      // Socket Logic
      const socket = io(process.env.API_URL, {
        transports: ['websocket'],
        query: {
          token,
        },
      });

      socket.on('player-move', data => {
        if (data._id === match._id) {
          setWhoseTurn(calculateWhoseTurn(data));
          setMatch({ type: 'UPDATE_MATCH', payload: data });
          if (authenticatedUserColor === 'black') {
            setRows(rows.reverse());
          }
        }
      });

      socket.on('player-joined', data => {
        if (data._id === match._id) {
          setWhoseTurn(calculateWhoseTurn(data));
          setMatch({ type: 'UPDATE_MATCH', payload: data });
        }
      });

      socket.on('player-ready', data => {
        if (data._id === match._id) {
          setOpponentIsReady(true);
        }
      });

      socket.on('connect', () => {
        console.log('connected booking');
      });

      socket.on('disconnect', () => {
        console.log('disconnected booking');
      });
    }
  }, [authenticatedUser, match, rows, token]);

  const findPiece = (column, row, color = null) => {
    if (color === 'white' || color === null) {
      const whitePiece = match.white.pieces.find(
        piece => piece.column === column && piece.row === row && piece.isAlive
      );

      if (whitePiece) {
        return { ...whitePiece, color: 'white' };
      }
    }

    if (color === 'black' || color === null) {
      const blackPiece = match.black.pieces.find(
        piece => piece.column === column && piece.row === row && piece.isAlive
      );

      if (blackPiece) {
        return { ...blackPiece, color: 'black' };
      }
    }

    return null;
  };

  const moveSelectedSetupPiece = (column, row) => {
    console.log('moveSelectedPiece');
    if (selectedPiece && selectedPiece._id) {
      const pieceIndex = match[playerPiecesColor].pieces.findIndex(
        ({ _id }) => _id === selectedPiece._id
      );
      const piece = match[playerPiecesColor].pieces[pieceIndex];
      if (piece.column === column && piece.row === row) {
        return;
      }

      // Move piece if a piece is selected
      piece.column = column;
      piece.row = row;
      setSelectedPiece(null);
      setMatch({ type: 'UPDATE_MATCH', payload: match });
    }
  };

  const renderGamePieces = () => (
    <div className="flex justify-center items-center text-sm font-semibold">
      <table>
        <tbody>
          {rows.map(row => (
            <tr key={row}>
              {columns.map(column => (
                <BoardPiece
                  key={column + row}
                  match={match}
                  column={column}
                  row={row}
                  columns={columns}
                  rows={rows}
                  playerPiecesColor={playerPiecesColor}
                  opponentIsReady={opponentIsReady}
                  whoseTurn={whoseTurn}
                  possibleMoves={possibleMoves}
                  selectedPiece={selectedPiece}
                  setMatch={setMatch}
                  setWhoseTurn={setWhoseTurn}
                  setSelectedPiece={setSelectedPiece}
                  setPossibleMoves={setPossibleMoves}
                  calculateWhoseTurn={calculateWhoseTurn}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSetupPiece = (column, row) => {
    // Do not render if not in specific row
    if (rows.slice(0, 5).includes(row)) {
      return <span className="p-8 bg-gray-800 w-full h-full" />;
    }

    // Render piece
    const piece = findPiece(column, row, playerPiecesColor);

    if (piece) {
      return (
        <span
          className="p-8 w-full h-full flex items-center justify-center"
          style={{ color: piece.color }}
          onClick={() => {
            setSelectedPiece(piece);
          }}
        >
          <div className="absolute">{piece.strength}</div>
        </span>
      );
    }

    return (
      <span
        className="p-8 w-full h-full"
        onClick={() => {
          if (selectedPiece && selectedPiece._id) {
            moveSelectedSetupPiece(column, row);
          }
        }}
      />
    );
  };

  const submitPieces = async e => {
    e.preventDefault();
    setLoadingSubmit(true);

    const submitPiecesData = {
      playerPieces: match[playerPiecesColor].pieces,
    };

    const {
      data: { data: submitPiecesResponse },
    } = await axios.patch(
      `${process.env.API_URL}/v1/matches/${match._id}/submit-pieces`,
      submitPiecesData
    );

    setMatch({ type: 'UPDATE_MATCH', payload: submitPiecesResponse });
    setLoadingSubmit(false);
  };

  const renderSetupPieces = () => (
    <div className="flex justify-center items-center text-sm font-semibold">
      <button
        onClick={submitPieces}
        className="cursor-pointer absolute bg-gray-600 border flex hover:bg-gray-500 items-center justify-center p-4 text-white z-50"
      >
        {loadingSubmit ? 'Loading...' : 'Submit Pieces'}
      </button>
      <table>
        <tbody>
          {rows.map(row => (
            <tr key={row}>
              {columns.map(column => {
                let cellColor = 'grey';
                if (
                  selectedPiece &&
                  selectedPiece.column === column &&
                  selectedPiece.row === row
                ) {
                  cellColor = 'purple';
                }
                return (
                  <td
                    key={column + row}
                    className="cursor-pointer relative border"
                    style={{ backgroundColor: cellColor }}
                  >
                    <div className="flex">{renderSetupPiece(column, row)}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!match) {
    return <div> NO MATCH!</div>;
  }

  return (
    <div className="capitalize">
      {!loading && (
        <div className="flex justify-center items-center mb-4">
          {match[playerPiecesColor].readyAt && (
            <span className="mr-3">Turn of {whoseTurn}</span>
          )}
          {opponentIsReady && <span className="mr-3">Opponent is ready!</span>}
        </div>
      )}
      {!loading && (
        <div>
          {match[playerPiecesColor].readyAt
            ? renderGamePieces()
            : renderSetupPieces()}
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center">Loading...</div>
      )}
    </div>
  );
};
export default Board;
