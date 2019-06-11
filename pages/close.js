import { useState, useReducer } from 'react';

const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    case 'reset':
      return 0;
    default:
      throw new Error('Unexpected action');
  }
};

const Page = () => {
  const [ignored, forceUpdate] = useReducer(x => x, 0);
  const [count, dispatch] = useReducer(reducer, initialState);
  const [trueOrFalse, toggleTrueOrFalse] = useState(false);

  console.log('re render');

  const handleClick1 = e => {
    e.preventDefault();
    dispatch('increment');
  };

  const handleClick = e => {
    e.preventDefault();
    forceUpdate();
  };

  return (
    <div className="flex items-center justify-center h-screen text-2xl h-screen flex-col">
      <div
        className="-mt-8"
        onClick={e => {
          e.preventDefault();
          toggleTrueOrFalse(!trueOrFalse);
        }}
      >
        TOGGLE {trueOrFalse}
      </div>
      <div className="-mt-8" onClick={handleClick1}>
        BUTTON {count}
      </div>
      <br />
      <div className="-mt-8" onClick={handleClick}>
        BUTTON {ignored}
      </div>
    </div>
  );
};

export default Page;
