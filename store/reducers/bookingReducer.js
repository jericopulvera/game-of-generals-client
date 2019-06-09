import bookingActionTypes from '../actionTypes/bookingActionTypes';
import initialState from '../initialState/booking';

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case bookingActionTypes.SET_PAGE:
      return Object.assign({}, state, { page: action.payload });
    case bookingActionTypes.SET_GOLF_COURSES:
      return Object.assign({}, state, {
        golfCourses: action.payload,
        golfCourse: action.payload[0].slug,
      });
    case bookingActionTypes.SET_DATE:
      return Object.assign({}, state, { date: action.payload });
    case bookingActionTypes.SET_GOLF_COURSE:
      return Object.assign({}, state, { golfCourse: action.payload });
    case bookingActionTypes.SET_HOLES:
      return Object.assign({}, state, { holes: action.payload });
    case bookingActionTypes.SET_PLAYER_COUNT:
      return Object.assign({}, state, { playerCount: action.payload });
    case bookingActionTypes.SET_SELECTED_TEE_TIME:
      return Object.assign({}, state, { selectedTeeTime: action.payload });

    case bookingActionTypes.SET_NEW_PLAYER_TYPE:
      return Object.assign({}, state, {
        playerType: action.payload,
      });
    case bookingActionTypes.SET_PLAYERS:
      return Object.assign({}, state, {
        players: action.payload,
      });
    case bookingActionTypes.SET_PLAYER:
      return Object.assign({}, state, {
        players: [...state.players, action.payload],
      });
    case bookingActionTypes.SET_QTY:
      return {
        ...state,
        dbAddOns: state.dbAddOns.map(item => {
          if (item._id === action.payload._id) {
            item = action.payload;
          }

          return item;
        }),
      };
    case bookingActionTypes.SET_ADD_ONS:
      return Object.assign({}, state, { addOns: action.payload });
    case bookingActionTypes.SET_TOTAL_ADD_ONS:
      return Object.assign({}, state, { totalAddOns: action.payload });
    case bookingActionTypes.SET_LOADING_PAYMENT:
      console.log({ action });
      return Object.assign({}, state, { loadingPayment: action.payload });

    default:
      return state;
  }
};

export default bookingReducer;
