import matchActionTypes from '../actionTypes/matchActionTypes';

const initialState = {
  _id: null,
  white: {},
  black: {},
  createdBy: null,
  createdAt: null,
  updatedAt: null,
  endedAt: null,
};

const matchReducer = (state = initialState, action) => {
  switch (action.type) {
    case matchActionTypes.SET_PAGE:
      return Object.assign({}, state, { page: action.payload });
    case matchActionTypes.SET_GOLF_COURSES:
      return Object.assign({}, state, {
        golfCourses: action.payload,
        golfCourse: action.payload[0].slug,
      });
    case matchActionTypes.SET_DATE:
      return Object.assign({}, state, { date: action.payload });
    case matchActionTypes.SET_GOLF_COURSE:
      return Object.assign({}, state, { golfCourse: action.payload });
    case matchActionTypes.SET_HOLES:
      return Object.assign({}, state, { holes: action.payload });
    case matchActionTypes.SET_PLAYER_COUNT:
      return Object.assign({}, state, { playerCount: action.payload });
    case matchActionTypes.SET_SELECTED_TEE_TIME:
      return Object.assign({}, state, { selectedTeeTime: action.payload });

    case matchActionTypes.SET_NEW_PLAYER_TYPE:
      return Object.assign({}, state, {
        playerType: action.payload,
      });
    case matchActionTypes.SET_PLAYERS:
      return Object.assign({}, state, {
        players: action.payload,
      });
    case matchActionTypes.SET_PLAYER:
      return Object.assign({}, state, {
        players: [...state.players, action.payload],
      });
    case matchActionTypes.SET_QTY:
      return {
        ...state,
        dbAddOns: state.dbAddOns.map(item => {
          if (item._id === action.payload._id) {
            item = action.payload;
          }

          return item;
        }),
      };
    case matchActionTypes.SET_ADD_ONS:
      return Object.assign({}, state, { addOns: action.payload });
    case matchActionTypes.SET_TOTAL_ADD_ONS:
      return Object.assign({}, state, { totalAddOns: action.payload });
    case matchActionTypes.SET_LOADING_PAYMENT:
      console.log({ action });
      return Object.assign({}, state, { loadingPayment: action.payload });

    default:
      return state;
  }
};

export default matchReducer;
