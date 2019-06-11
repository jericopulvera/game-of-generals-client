import axios from 'axios';

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : 'http://localhost:3333';

export function movePiece({ matchId, pieceId, targetColumn, targetRow }) {
  return axios.patch(`${apiUrl}/v1/matches/${matchId}/move-piece`, {
    pieceId,
    targetColumn,
    targetRow,
  });
}
