import userActionTypes from '../actionTypes/userActionTypes';

export function setUser(user) {
  return {
    type: userActionTypes.SET_USER,
    payload: user,
  };
}

export function removeUser() {
  return {
    type: userActionTypes.REMOVE_USER,
    payload: null,
  };
}
