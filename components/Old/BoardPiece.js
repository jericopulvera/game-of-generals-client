import axios from 'axios';

const BoardPiece = props => {
  const {
    match,
    column,
    row,
    columns,
    rows,
    playerPiecesColor,
    opponentIsReady,
    whoseTurn,
    possibleMoves,
    selectedPiece,
    setMatch,
    setWhoseTurn,
    setSelectedPiece,
    setPossibleMoves,
    calculateWhoseTurn,
  } = props;

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

  const findPossibleMoves = piece => {
    let possibleMoves = [];
    const columnIndex = columns.findIndex(column => column === piece.column);
    const rowIndex = rows.findIndex(row => row === piece.row);

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
      move => !findPiece(move.column, move.row, playerPiecesColor)
    );

    return possibleMoves;
  };

  const selectCell = async (e, column, row) => {
    e.preventDefault();

    if (!opponentIsReady) {
      return;
    }

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
        column: move.column,
        row: move.row,
      };

      const {
        data: { data: matchResponse },
      } = await axios.patch(
        `${process.env.API_URL}/v1/matches/${match._id}/move-piece`,
        moveData
      );

      setMatch({ type: 'UPDATE_MATCH', payload: matchResponse });
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
      selectedPiece.column === column &&
      selectedPiece.row === row
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

  const renderGamePiece = (column, row) => {
    const piece = findPiece(column, row);

    if (piece) {
      return (
        <span
          className="p-8 w-full h-full flex items-center justify-center"
          style={{ color: piece.color }}
        >
          <div className="absolute">
            {piece.strength === 777 ? '?' : piece.strength}
          </div>
        </span>
      );
    }

    return <span className="p-8 w-full h-full" />;
  };

  return (
    <td
      key={column + row}
      className="cursor-pointer relative border"
      style={{
        backgroundColor: getPieceBackgroundColor(column, row),
      }}
      onClick={e => selectCell(e, column, row)}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        {renderGamePiece(column, row)}
      </div>
    </td>
  );
};

export default BoardPiece;
