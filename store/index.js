import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// REDUCERS
import userReducer from './reducers/userReducer.js';

const exampleInitialState = {
  user: null,
};

export const reducer = combineReducers({
  user: userReducer,
});

export function initializeStore(initialState = exampleInitialState) {
  const store = createStore(reducer, initialState, composeWithDevTools());

  return store;
}
