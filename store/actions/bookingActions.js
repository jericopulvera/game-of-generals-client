import bookingActionTypes from '../actionTypes/bookingActionTypes';

export function setPage(page) {
  return {
    type: bookingActionTypes.SET_PAGE,
    payload: page,
  };
}

export function setGolfCourses(golfCourses) {
  return {
    type: bookingActionTypes.SET_GOLF_COURSES,
    payload: golfCourses,
  };
}

export function setDate(date) {
  return {
    type: bookingActionTypes.SET_DATE,
    payload: date,
  };
}

export function setGolfCourse(golfCourseId) {
  return {
    type: bookingActionTypes.SET_GOLF_COURSE,
    payload: golfCourseId,
  };
}

export function setHoles(holes) {
  return {
    type: bookingActionTypes.SET_HOLES,
    payload: holes,
  };
}

export function setPlayerCount(playerCount) {
  return {
    type: bookingActionTypes.SET_PLAYER_COUNT,
    payload: playerCount,
  };
}

export function setSelectedTeeTime(teeTime) {
  return {
    type: bookingActionTypes.SET_SELECTED_TEE_TIME,
    payload: teeTime,
  };
}

export function setNewPlayerType(type) {
  return {
    type: bookingActionTypes.SET_NEW_PLAYER_TYPE,
    payload: type,
  };
}

export function setPlayers(players) {
  return {
    type: bookingActionTypes.SET_PLAYERS,
    payload: players,
  };
}

export function setPlayer(player) {
  return {
    type: bookingActionTypes.SET_PLAYER,
    payload: player,
  };
}

export function setQty(item) {
  return {
    type: bookingActionTypes.SET_QTY,
    payload: item,
  };
}

export function setAddOns(items) {
  return {
    type: bookingActionTypes.SET_ADD_ONS,
    payload: items,
  };
}

export function setTotalAddOns(total) {
  return {
    type: bookingActionTypes.SET_TOTAL_ADD_ONS,
    payload: total,
  };
}

export function setLoadingPayment(trueOrFalse) {
  return {
    type: bookingActionTypes.SET_LOADING_PAYMENT,
    payload: trueOrFalse,
  };
}
