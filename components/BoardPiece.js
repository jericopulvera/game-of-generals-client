import { movePiece } from '@api/match';

const isOpponentPiece = (match, piece, opponentPiecesColor) =>
  Boolean(
    match[opponentPiecesColor].pieces.find(({ _id }) => _id === piece._id)
  );

const BoardPiece = props => {
  const {
    match,
    piece,
    selectedPiece,
    setSelectedPiece,
    playerPiecesColor,
    setMatch,
    validMoves,
  } = props;

  const opponentPiecesColor = playerPiecesColor !== 'white' ? 'white' : 'black';
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

  return (
    <span
      className={`absolute inset-0 ${pieceColor} ${pieceBackgroundColor}`}
      onClick={() => {
        const isValidMove = validMoves.find(
          move => move.column === piece.column && move.row === piece.row
        );
        if (selectedPiece && isValidMove && pieceIsOpponent) {
          movePiece({
            matchId: match._id,
            pieceId: selectedPiece._id,
            targetColumn: piece.column,
            targetRow: piece.row,
          })
            .then(response => {
              setMatch({ type: 'UPDATE_MATCH', payload: response.data.data });
            })
            .catch(error => {
              console.log(error);
              alert('Something went wrong. Please reload the page.');
            });
        } else {
          setSelectedPiece(piece);
        }
      }}
    >
      {piece.strength}
    </span>
  );
};

export default BoardPiece;
