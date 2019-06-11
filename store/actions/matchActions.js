import matchActionTypes from '../actionTypes/matchActionTypes';

export function setPage(page) {
  return {
    type: matchActionTypes.SET_PAGE,
    payload: page,
  };
}

export function setGolfCourses(golfCourses) {
  return {
    type: matchActionTypes.SET_GOLF_COURSES,
    payload: golfCourses,
  };
}

export function setDate(date) {
  return {
    type: matchActionTypes.SET_DATE,
    payload: date,
  };
}

export function setGolfCourse(golfCourseId) {
  return {
    type: matchActionTypes.SET_GOLF_COURSE,
    payload: golfCourseId,
  };
}

export function setHoles(holes) {
  return {
    type: matchActionTypes.SET_HOLES,
    payload: holes,
  };
}

export function setPlayerCount(playerCount) {
  return {
    type: matchActionTypes.SET_PLAYER_COUNT,
    payload: playerCount,
  };
}

export function setSelectedTeeTime(teeTime) {
  return {
    type: matchActionTypes.SET_SELECTED_TEE_TIME,
    payload: teeTime,
  };
}

export function setNewPlayerType(type) {
  return {
    type: matchActionTypes.SET_NEW_PLAYER_TYPE,
    payload: type,
  };
}

export function setPlayers(players) {
  return {
    type: matchActionTypes.SET_PLAYERS,
    payload: players,
  };
}

export function setPlayer(player) {
  return {
    type: matchActionTypes.SET_PLAYER,
    payload: player,
  };
}

export function setQty(item) {
  return {
    type: matchActionTypes.SET_QTY,
    payload: item,
  };
}

export function setAddOns(items) {
  return {
    type: matchActionTypes.SET_ADD_ONS,
    payload: items,
  };
}

export function setTotalAddOns(total) {
  return {
    type: matchActionTypes.SET_TOTAL_ADD_ONS,
    payload: total,
  };
}

export function setLoadingPayment(trueOrFalse) {
  return {
    type: matchActionTypes.SET_LOADING_PAYMENT,
    payload: trueOrFalse,
  };
}
