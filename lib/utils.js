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

export function findUserBooking(booking, authenticatedUser) {
  if (!booking || !authenticatedUser) {
    return { ...booking };
    // throw Error('findUserBooking method requires booking and user parameter');
  }

  const bookingIsChild = booking.children.find(
    ({ client }) => client && client.user._id === authenticatedUser._id
  );

  if (bookingIsChild) {
    return Object.assign({}, { ...bookingIsChild, teeTime: booking.teeTime });
  }

  return { ...booking };
}
