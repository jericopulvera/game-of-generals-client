import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { parseCookies } from 'nookies';

function calculateWhoseTurn(match) {
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
}

const Board = props => {
  const { match: matchData, user: authenticatedUser } = props;
  const { token } = parseCookies(props);
  const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  const defaultRows = [8, 7, 6, 5, 4, 3, 2, 1];

  const [rows, setRows] = useState(defaultRows);

  const [match, setMatch] = useState(matchData);
  const [playerPiecesColor, setPlayerPiecesColor] = useState(null);

  const [whoseTurn, setWhoseTurn] = useState(calculateWhoseTurn(match));
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  useEffect(() => {
    if (authenticatedUser) {
      const authenticatedUserColor =
        match.white.user === authenticatedUser._id ? 'white' : 'black';
      setPlayerPiecesColor(authenticatedUserColor);
      if (authenticatedUserColor === 'black') {
        setRows(rows.reverse());
      }
    }
    const socket = io(process.env.API_URL, {
      transports: ['websocket'],
      query: {
        token,
      },
    });

    socket.on('player-move', data => {
      if (data._id === match._id) {
        setWhoseTurn(calculateWhoseTurn(data));
        setMatch(data);
      }
    });

    socket.on('player-joined', data => {
      if (data._id === match._id) {
        setWhoseTurn(calculateWhoseTurn(data));
        setMatch(data);
      }
    });

    socket.on('connect', () => {
      console.log('connected booking');
    });

    socket.on('disconnect', () => {
      console.log('disconnected booking');
    });
  }, [authenticatedUser, match._id, match.white.user, rows, token]);

  const findPiece = (column, row, color = null) => {
    if (color === 'white' || color === null) {
      const whitePiece = match.white.pieces.find(
        piece =>
          piece.position === column &&
          piece.positionNumber === row &&
          piece.isAlive
      );

      if (whitePiece) {
        return { ...whitePiece, color: 'white' };
      }
    }

    if (color === 'black' || color === null) {
      const blackPiece = match.black.pieces.find(
        piece =>
          piece.position === column &&
          piece.positionNumber === row &&
          piece.isAlive
      );

      if (blackPiece) {
        return { ...blackPiece, color: 'black' };
      }
    }

    return null;
  };

  const findPossibleMoves = piece => {
    let possibleMoves = [];
    const positionIndex = columns.findIndex(
      column => column === piece.position
    );
    const positionNumberIndex = rows.findIndex(
      row => row === piece.positionNumber
    );

    // Move up | positionNumberIndex + 1
    possibleMoves.push({
      column: columns[positionIndex],
      row: rows[positionNumberIndex + 1],
    });

    // Move Down
    possibleMoves.push({
      column: columns[positionIndex],
      row: rows[positionNumberIndex - 1],
    });

    // Move Left
    possibleMoves.push({
      column: columns[positionIndex - 1],
      row: rows[positionNumberIndex],
    });

    // Move Right
    possibleMoves.push({
      column: columns[positionIndex + 1],
      row: rows[positionNumberIndex],
    });

    // Remove possible moves if there is allied piece in cell
    possibleMoves = possibleMoves.filter(
      move => !findPiece(move.column, move.row, playerPiecesColor)
    );

    return possibleMoves;
  };

  // const pieceMoved = (piece, newPosition, newPositionNumber) => {
  //   piece.positionHistory.push({
  //     position: piece.position,
  //     positionNumber: piece.positionNumber,
  //   });
  //   piece.position = newPosition;
  //   piece.positionNumber = newPositionNumber;

  //   // Find and replace match piece
  //   const index = match[playerPiecesColor].pieces.findIndex(
  //     ({ _id }) => _id === piece._id
  //   );

  //   match[playerPiecesColor].pieces[index] = piece;

  //   setMatch(match);
  // };

  const selectCell = async (e, column, row) => {
    e.preventDefault();

    if (playerPiecesColor !== whoseTurn) {
      return;
    }

    // Move if Piece is selected
    const move = possibleMoves.find(
      move => move.column === column && move.row === row
    );
    if (move) {
      const moveData = {
        pieceId: selectedPiece._id,
        position: move.column,
        positionNumber: move.row,
      };

      const {
        data: { data: matchResponse },
      } = await axios.patch(
        `${process.env.API_URL}/v1/matches/${match._id}/move-piece`,
        moveData
      );

      setMatch(matchResponse);
      setWhoseTurn(calculateWhoseTurn(matchResponse));
      setSelectedPiece(null);
      setPossibleMoves([]);
      return;
    }

    // Select Piece if not moving
    const piece = findPiece(column, row);
    if (piece && piece.color === playerPiecesColor) {
      setSelectedPiece(piece);

      const possibleMoves = findPossibleMoves(piece);
      setPossibleMoves(possibleMoves);
    }
  };

  const getPieceBackgroundColor = (column, row) => {
    // Highlight selected piece
    if (
      selectedPiece &&
      selectedPiece.position === column &&
      selectedPiece.positionNumber === row
    ) {
      return 'green';
    }

    // Highlight possible moves
    if (
      possibleMoves.find(move => move.column === column && move.row === row)
    ) {
      return 'green';
    }

    return 'grey';
  };

  const renderPiece = (column, row) => {
    const piece = findPiece(column, row);

    if (piece) {
      return <span style={{ color: piece.color }}>{piece.strength}</span>;
    }

    return <span />;
  };

  if (!match) {
    return <div> NO MATCH!</div>;
  }

  return (
    <div className="capitalize">
      <div className="flex justify-center items-center mb-4">
        <span className="mr-3">Turn of {whoseTurn}</span>
      </div>
      <table className="flex justify-center items-center">
        <tbody className="">
          {rows.map(row => (
            <tr key={row}>
              {columns.map(column => (
                <td
                  key={column + row}
                  style={{
                    padding: '20px',
                    border: '1px solid',
                    backgroundColor: getPieceBackgroundColor(column, row),
                    position: 'relative',
                  }}
                  onClick={e => selectCell(e, column, row)}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span className="text-red-900 ml-2 top-0 left-0 absolute">
                      {column} {row}
                    </span>
                    {renderPiece(column, row)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Board;
