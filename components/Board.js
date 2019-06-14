import { useState, useEffect, useReducer } from 'react';
import Link from 'next/link';
import * as matchApi from '@api/match';
import BoardCell from './BoardCell';

const matchReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_MATCH':
      return { ...state, ...action.payload };
    case 'OPPONENT_JOINED': {
      const { opponentPiecesColor, user } = action.payload;
      const updatedState = { ...state };
      updatedState[opponentPiecesColor] = {
        ...state[opponentPiecesColor],
        user,
      };
      return { ...updatedState };
    }
    case 'OPPONENT_READY': {
      const { opponentPiecesColor, opponentData } = action.payload;
      const updatedState = { ...state };
      updatedState[opponentPiecesColor] = {
        ...opponentData,
      };
      return { ...updatedState };
    }
    case 'MOVE_PIECE': {
      const {
        playerPiecesColor,
        selectedPieceId,
        targetColumn,
        targetRow,
      } = action.payload;
      // If piece opponent piece exists in the same spot remove piece.
      const movingPieceIndex = state[playerPiecesColor].pieces.findIndex(
        ({ _id }) => _id === selectedPieceId
      );

      const updatedState = { ...state };
      updatedState[playerPiecesColor] = {
        user: state[playerPiecesColor].user,
        readyAt: state[playerPiecesColor].readyAt,
        pieces: state[playerPiecesColor].pieces.map((piece, index) => {
          if (index === movingPieceIndex) {
            return {
              ...piece,
              column: targetColumn,
              row: targetRow,
            };
          }
          return piece;
        }),
      };

      return { ...updatedState };
    }
    case 'END_GAME':
      return { ...state, endedAt: true };
    default:
      throw new Error('Unexpected action');
  }
};

const calculateWhoseTurn = match => {
  const blackMovesSum = match.black.pieces.reduce(
    (accumulator, piece) => accumulator + piece.positionHistory.length,
    0
  );

  const whiteMovesSum = match.white.pieces.reduce(
    (accumulator, piece) => accumulator + piece.positionHistory.length,
    0
  );

  const whiteCanMove = whiteMovesSum === blackMovesSum;

  return whiteCanMove ? 'white' : 'black';
};

const useSocketIO = (socket, match, setMatch, opponentPiecesColor) => {
  useEffect(() => {
    if (socket) {
      socket.on('player-joined', data => {
        if (data._id === match._id) {
          setMatch({
            type: 'OPPONENT_JOINED',
            payload: {
              opponentPiecesColor,
              user: data[opponentPiecesColor].user,
            },
          });
        }
      });

      socket.on('player-ready', data => {
        if (data._id === match._id) {
          setMatch({
            type: 'OPPONENT_READY',
            payload: {
              opponentPiecesColor,
              opponentData: data[opponentPiecesColor],
            },
          });
        }
      });

      socket.on('player-move', data => {
        if (data._id === match._id) {
          setMatch({ type: 'UPDATE_MATCH', payload: data });
        }
      });
    }
  }, [match._id, opponentPiecesColor, setMatch, socket]);
};

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const Board = props => {
  console.log('Board Rendered!');
  const { match: matchData, user: authenticatedUser, socket } = props;

  const [match, setMatch] = useReducer(matchReducer, matchData);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [rows, setRows] = useState([8, 7, 6, 5, 4, 3, 2, 1]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const whoseTurn = calculateWhoseTurn(match);

  // Constants
  const playerPiecesColor =
    match.white.user &&
    authenticatedUser &&
    match.white.user._id === authenticatedUser._id
      ? 'white'
      : 'black';

  const opponentPiecesColor = playerPiecesColor !== 'white' ? 'white' : 'black';
  const setupBoundary = playerPiecesColor === 'white' ? [1, 2, 3] : [8, 7, 6];
  const playerIsReady = Boolean(match[playerPiecesColor].readyAt);
  const opponentIsReady = Boolean(match[opponentPiecesColor].readyAt);

  useSocketIO(socket, match, setMatch, opponentPiecesColor);

  useEffect(() => {
    if (playerPiecesColor === 'black') {
      setRows([8, 7, 6, 5, 4, 3, 2, 1].reverse());
    }

    setLoading(false);
  }, [match._id, playerPiecesColor]);

  const submitPieces = async e => {
    e.preventDefault();
    setLoadingSubmit(true);

    const {
      data: { data: submitPiecesResponse },
    } = await matchApi.submitPieces({
      matchId: match._id,
      playerPieces: match[playerPiecesColor].pieces,
    });

    setMatch({ type: 'UPDATE_MATCH', payload: submitPiecesResponse });
    setLoadingSubmit(false);
  };

  return (
    <div className="capitalize flex flex-col justify-center items-center text-sm font-semibold">
      {/* LOADING INDICATOR */}
      {loading && (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      {/* GAME ENDED */}
      {!loading && match.winner && (
        <div
          onClick={submitPieces}
          className="absolute bg-white border flex items-center justify-center p-4 text-white z-50 border-black"
          style={{ top: '12.5rem' }}
        >
          <span className="capitalize flex flex-col text-center text-gray-800">
            {match.white.user === match.winner._id ? 'White' : 'Black'} Wins
            <Link href="/">
              <a className="cursor-pointer underline">Navigate To Home</a>
            </Link>
          </span>
        </div>
      )}

      {/* SUBMIT PIECES BUTTON */}
      {!loading && !playerIsReady && (
        <button
          onClick={submitPieces}
          className="cursor-pointer absolute bg-gray-600 border flex hover:bg-gray-500 items-center justify-center p-4 text-white z-50"
          style={{ top: '12.5rem' }}
        >
          {loadingSubmit ? 'Loading...' : 'Submit Pieces'}
        </button>
      )}

      {/* BOARD TABLE */}
      {!loading && (
        <table>
          <tbody>
            {rows.map(row => (
              <tr key={row}>
                {columns.map(column => (
                  <BoardCell
                    key={column + row}
                    columns={columns}
                    rows={rows}
                    column={column}
                    row={row}
                    match={match}
                    setMatch={setMatch}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    playerPiecesColor={playerPiecesColor}
                    opponentPiecesColor={opponentPiecesColor}
                    playerIsReady={playerIsReady}
                    validMoves={validMoves}
                    setupBoundary={setupBoundary}
                    whoseTurn={whoseTurn}
                    setValidMoves={setValidMoves}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MATCH DETAILS */}
      {!loading && (
        <div className="p-2 mt-2  border bg-gray-500">
          <p>
            {playerPiecesColor}:{' '}
            <span className="lowercase">
              {match[playerPiecesColor].user
                ? match[playerPiecesColor].user.email
                : 'N/A'}{' '}
            </span>
          </p>
          <p>
            {opponentPiecesColor}:{' '}
            <span className="lowercase">
              {match[opponentPiecesColor].user
                ? match[opponentPiecesColor].user.email
                : 'N/A'}
            </span>
          </p>
          <p>Ready: {String(playerIsReady)}</p>
          <p>Opponent Ready: {String(opponentIsReady)}</p>
          <p>Turn: {whoseTurn}</p>
        </div>
      )}

      {/* ACTIONS */}
      {!loading && (
        <button
          className="p-2 rounded m-2"
          onClick={() => {
            setRows([...rows.reverse()]);
          }}
        >
          FLIP BOARD
        </button>
      )}
    </div>
  );
};

export default Board;
