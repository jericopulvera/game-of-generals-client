import { findPiece } from '@lib/utils';
import { movePiece } from '@api/match';
import BoardPiece from './BoardPiece';

const BoardCell = props => {
  const {
    match,
    column,
    row,
    playerPiecesColor,
    setMatch,
    selectedPiece,
    setSelectedPiece,
    validMoves,
  } = props;

  const piece = findPiece(match, column, row);

  const renderEmptyCell = () => {
    const isHighlighted = validMoves.find(
      move => column === move.column && row === move.row
    );
    return (
      <span
        className={`absolute inset-0 ${isHighlighted && 'bg-red-400'}`}
        onClick={() => {
          if (selectedPiece) {
            movePiece({
              matchId: match._id,
              pieceId: selectedPiece._id,
              targetColumn: column,
              targetRow: row,
            })
              .then(response => {
                setMatch({
                  type: 'UPDATE_MATCH',
                  payload: response.data.data,
                });
              })
              .catch(error => {
                console.log(error);
                alert('Something went wrong. Please reload the page.');
              });
          }
        }}
      />
    );
  };

  return (
    <td className="cursor-pointer relative border bg-gray-500">
      <div className="w-8 h-8 sm:w-16 sm:h-16 text-center">
        {piece && (
          <BoardPiece
            piece={piece}
            match={match}
            setMatch={setMatch}
            selectedPiece={selectedPiece}
            setSelectedPiece={setSelectedPiece}
            playerPiecesColor={playerPiecesColor}
            validMoves={validMoves}
          />
        )}
        {!piece && renderEmptyCell()}
      </div>
    </td>
  );
};

export default BoardCell;
