import React, { useEffect, useRef } from 'react';
import * as bookingActions from '@store/actions/bookingActions';
import { connect } from 'react-redux';

const PlayerTypeModal = props => {
  const { setPage, setNewPlayerType, playerTypes } = props;
  const formElement = useRef(null);

  useEffect(() => {
    const handleClick = e => {
      if (formElement.current && !formElement.current.contains(e.target)) {
        props.onClose();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [props]);

  const handleSubmit = e => {
    e.preventDefault();
    props.onClose();
    setPage(4);
  };

  const handleOptionChange = (changeEvent, playerTypes) => {
    setNewPlayerType(playerTypes);
  };

  return (
    // <div className='fixed h-screen w-full flex items-center justify-center'>
    <div className="w-full flex items-center justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        ref={formElement}
        onSubmit={handleSubmit}
      >
        <div className="relative" style={{ top: '-17px', right: '-20px' }}>
          <a
            onClick={props.onClose}
            className="font-bold cursor-pointer text-gray-500 text-xs absolute right-0"
          >
            X
          </a>
        </div>

        <div className="row">
          {playerTypes.map(playerTypes => (
            <div key={playerTypes.slug} className="column">
              <input
                className="mr-4"
                type="radio"
                name="playerType"
                onChange={e => handleOptionChange(e, playerTypes)}
                value={playerTypes.slug}
              />
              <label>{playerTypes.name}</label>
            </div>
          ))}
        </div>

        <div>
          <button
            className="next float-left rounded-lg py-2 px-6 bg-gray-400 my-2"
            type="button"
            onClick={props.onClose}
          >
            Cancel
          </button>

          <button
            onClick={() => setPage(2)}
            className="next float-right rounded-lg py-2 px-6 bg-gray-400 my-2"
            type="submit"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

const mapDispatchToProps = bookingActions;
const mapStateToProps = state => state.booking;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerTypeModal);
