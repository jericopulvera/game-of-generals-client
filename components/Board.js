import { useState, useEffect, useReducer } from 'react';
import { findPiece } from '@lib/utils';
import BoardCell from './BoardCell';

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

const useGetSelectedPieceValidMoves = (
  match,
  selectedPiece,
  columns,
  rows,
  playerPiecesColor,
  setValidMoves
) => {
  useEffect(() => {
    if (!selectedPiece) return;

    let possibleMoves = [];
    const columnIndex = columns.findIndex(
      column => column === selectedPiece.column
    );
    const rowIndex = rows.findIndex(row => row === selectedPiece.row);

    // Move up | rowIndex + 1
    possibleMoves.push({
      column: columns[columnIndex],
      row: rows[rowIndex + 1],
    });

    // Move Down
    possibleMoves.push({
      column: columns[columnIndex],
      row: rows[rowIndex - 1],
    });

    // Move Left
    possibleMoves.push({
      column: columns[columnIndex - 1],
      row: rows[rowIndex],
    });

    // Move Right
    possibleMoves.push({
      column: columns[columnIndex + 1],
      row: rows[rowIndex],
    });

    // Remove possible moves if there is allied piece in cell
    possibleMoves = possibleMoves.filter(
      move => !findPiece(match, move.column, move.row, playerPiecesColor)
    );

    console.log({ possibleMoves });

    setValidMoves([...possibleMoves]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPiece]);
};

const useSocketIO = (socket, match, setMatch) => {
  useEffect(() => {
    if (socket) {
      socket.on('player-move', data => {
        console.log(data._id === match._id, 'isMatch?');
        if (data._id === match._id) {
          console.log('PLAYER MOVED');
          setMatch({ type: 'UPDATE_MATCH', payload: data });
        }
      });

      socket.on('player-joined', data => {
        if (data._id === match._id) {
          setMatch({ type: 'UPDATE_MATCH', payload: data });
        }
      });

      // socket.on('player-ready', data => {
      //   if (data._id === match._id) {
      //     setOpponentIsReady(true);
      //   }
      // });
    }
  });
};

const Board = props => {
  console.log('Board Rendered!');
  const { match: matchData, user, socket } = props;

  // Constants
  const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  const initialRows = [8, 7, 6, 5, 4, 3, 2, 1];
  const playerPiecesColor =
    matchData.white.user === user._id ? 'white' : 'black';

  const [match, setMatch] = useReducer(matchReducer, matchData);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState(initialRows);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const whoseTurn = calculateWhoseTurn(match);

  useSocketIO(socket, match, setMatch);
  useGetSelectedPieceValidMoves(
    match,
    selectedPiece,
    columns,
    rows,
    playerPiecesColor,
    setValidMoves
  );

  useEffect(() => {
    if (playerPiecesColor === 'black') {
      setRows([8, 7, 6, 5, 4, 3, 2, 1].reverse());
    }

    setLoading(false);
  }, [match._id, playerPiecesColor]);

  return (
    <div className="capitalize flex flex-col justify-center items-center text-sm font-semibold">
      {loading && (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      {!loading && (
        <table>
          <tbody>
            {rows.map(row => (
              <tr key={row}>
                {columns.map(column => (
                  <BoardCell
                    key={column + row}
                    column={column}
                    row={row}
                    match={match}
                    setMatch={setMatch}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    playerPiecesColor={playerPiecesColor}
                    validMoves={validMoves}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={`p-2 mt-2 text-${playerPiecesColor} border bg-gray-500`}>
        <p>Playing: {playerPiecesColor}</p>
        <p>Turn: {whoseTurn}</p>
      </div>
      <button
        className="p-2 rounded m-2"
        onClick={() => {
          setRows([...rows.reverse()]);
        }}
      >
        FLIP BOARD
      </button>
    </div>
  );
};

export default Board;
