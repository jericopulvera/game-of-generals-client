/* eslint-disable no-nested-ternary */
export function popupCenter(url, title, w, h) {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  const finalHeight = h / systemZoom;
  const finalWidth = w / systemZoom;
  const newWindow = window.open(
    url,
    title,
    `scrollbars=no, toolbar=no, width=${finalWidth},height=${finalHeight},top=${top},left=${left}`
  );

  // Puts focus on the newWindow
  if (newWindow) {
    newWindow.focus();
  }

  return newWindow;
}

export function findPiece(match, column, row, color = null) {
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
}
