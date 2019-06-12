import { findPiece } from '@lib/utils';
import { movePiece } from '@api/match';
import BoardPiece from './BoardPiece';

const BoardCell = props => {
  const {
    match,
    columns,
    rows,
    column,
    row,
    playerPiecesColor,
    opponentPiecesColor,
    playerIsReady,
    setMatch,
    selectedPiece,
    setSelectedPiece,
    validMoves,
    setupBoundary,
    whoseTurn,
    setValidMoves,
  } = props;

  const piece = findPiece(match, column, row);

  const renderEmptyCell = () => {
    // Hide opponent piece when setting up pieces
    if (!setupBoundary.includes(row) && !playerIsReady) {
      return <span className="absolute inset-0 bg-black" />;
    }

    const isValidMove = validMoves.find(
      move => column === move.column && row === move.row
    );

    return (
      <span
        className={`absolute inset-0 ${isValidMove && 'bg-red-400'}`}
        onClick={() => {
          if (!playerIsReady && selectedPiece) {
            setMatch({
              type: 'MOVE_PIECE',
              payload: {
                playerPiecesColor,
                selectedPieceId: selectedPiece._id,
                targetColumn: column,
                targetRow: row,
              },
            });
            return;
          }

          if (selectedPiece && isValidMove) {
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
                setSelectedPiece(null);
              })
              .catch(error => {
                console.log(error);
                alert('Something went wrong. Please reload the page.');
              });
          }

          setValidMoves([]);
        }}
      />
    );
  };

  return (
    <td className="cursor-pointer relative border bg-gray-500">
      <div className="w-8 h-8 sm:w-16 sm:h-16 text-center">
        {piece && (
          <BoardPiece
            columns={columns}
            rows={rows}
            piece={piece}
            match={match}
            setMatch={setMatch}
            selectedPiece={selectedPiece}
            setSelectedPiece={setSelectedPiece}
            playerPiecesColor={playerPiecesColor}
            playerIsReady={playerIsReady}
            opponentPiecesColor={opponentPiecesColor}
            validMoves={validMoves}
            setupBoundary={setupBoundary}
            whoseTurn={whoseTurn}
            setValidMoves={setValidMoves}
          />
        )}
        {!piece && renderEmptyCell()}
      </div>
    </td>
  );
};

export default BoardCell;
