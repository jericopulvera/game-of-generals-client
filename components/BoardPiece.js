import { movePiece } from '@api/match';
import { findPiece } from '@lib/utils';

const isOpponentPiece = (match, piece, opponentPiecesColor) =>
  Boolean(
    match[opponentPiecesColor].pieces.find(({ _id }) => _id === piece._id)
  );

const BoardPiece = props => {
  const {
    match,
    piece,
    columns,
    rows,
    selectedPiece,
    setSelectedPiece,
    playerPiecesColor,
    playerIsReady,
    opponentPiecesColor,
    setMatch,
    validMoves,
    setupBoundary,
    whoseTurn,
    setValidMoves,
  } = props;

  const pieceIsOpponent = isOpponentPiece(match, piece, opponentPiecesColor);
  const pieceColor = pieceIsOpponent
    ? `text-${opponentPiecesColor}`
    : `text-${playerPiecesColor}`;

  let pieceBackgroundColor = '';
  if (
    (selectedPiece && selectedPiece._id === piece._id) ||
    (pieceIsOpponent &&
      validMoves.find(
        ({ column, row }) => column === piece.column && row === piece.row
      ))
  ) {
    pieceBackgroundColor = 'bg-red-400';
  }

  // Hide opponent piece when setting up pieces
  if (!setupBoundary.includes(piece.row) && !playerIsReady) {
    return <span className="absolute inset-0 bg-black" />;
  }

  const getValidMoves = selectedPiece => {
    if (!selectedPiece || !playerIsReady) {
      setValidMoves([]);
      return;
    }

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

    setValidMoves([...possibleMoves]);
  };

  return (
    <span
      className={`absolute inset-0 ${pieceColor} ${pieceBackgroundColor}`}
      onClick={() => {
        // Prevent selecting piece when not in turn
        if (playerIsReady && whoseTurn !== playerPiecesColor) {
          return;
        }

        const isValidMove = validMoves.find(
          move => move.column === piece.column && move.row === piece.row
        );

        // Prevent selecting opponent piece
        if (!isValidMove && pieceIsOpponent) {
          return;
        }

        if (selectedPiece && isValidMove && pieceIsOpponent) {
          movePiece({
            matchId: match._id,
            pieceId: selectedPiece._id,
            targetColumn: piece.column,
            targetRow: piece.row,
          })
            .then(response => {
              setMatch({ type: 'UPDATE_MATCH', payload: response.data.data });
              setSelectedPiece(null);
              setValidMoves([]);
            })
            .catch(error => {
              console.log(error);
              alert('Something went wrong. Please reload the page.');
            });
        } else {
          setSelectedPiece(piece);
          getValidMoves(piece);
        }
      }}
    >
      {piece.strength}
    </span>
  );
};

export default BoardPiece;
