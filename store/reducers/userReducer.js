import userActionTypes from '../actionTypes/userActionTypes';

const initialState = null;

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userActionTypes.SET_USER:
      return Object.assign({}, action.payload);
    case userActionTypes.REMOVE_USER:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
