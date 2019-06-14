import { useState, useEffect } from 'react';
import axios from 'axios';
import defaultLayout from '@layouts/defaultLayout';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Router from 'next/router';

dayjs.extend(relativeTime);

const useSocketIO = (socket, matches, setMatches) => {
  useEffect(() => {
    if (socket) {
      socket.on('new-match', newMatch => {
        setMatches([newMatch, ...matches]);
      });
    }
  }, [matches, setMatches, socket]);
};

const Page = props => {
  console.log('Home Page Rendered!');
  const { matches: matchesData, user: authenticatedUser, socket } = props;
  const [matches, setMatches] = useState(matchesData);

  useSocketIO(socket, matches, setMatches);

  const createMatch = async e => {
    e.preventDefault();

    if (!authenticatedUser) {
      alert('You must be logged in to create a match.');
      return;
    }

    const {
      data: { data: match },
    } = await axios.post(`${process.env.API_URL}/v1/matches`);

    Router.push(
      `/matches/_matchId?matchId=${match._id}`,
      `/matches/${match._id}`
    );
  };

  const joinMatch = async (e, match) => {
    e.preventDefault();

    if (!authenticatedUser) {
      alert('You must be logged in to join a match.');
      return;
    }

    try {
      const {
        data: { data: joinResponse },
      } = await axios.patch(
        `${process.env.API_URL}/v1/matches/${match._id}/join-match`
      );

      Router.push(
        `/matches/_matchId?matchId=${joinResponse._id}`,
        `/matches/${match._id}`
      );
    } catch (error) {
      alert('Something went wrong!');
      console.log({ error });
    }
  };

  const renderJoinButton = match => {
    const player1 = match.white.user ? match.white.user._id : null;
    const player2 = match.black.user ? match.black.user._id : null;
    if (
      !authenticatedUser || // if not logged in show join match
      (player1 === null && player2 !== authenticatedUser._id) ||
      (player2 === null && player1 !== authenticatedUser._id)
    ) {
      return (
        <button
          className="text-blue-300 hover:text-blue-700 mt-1"
          onClick={e => joinMatch(e, match)}
        >
          Join Match
        </button>
      );
    }
  };

  const renderMatch = match => (
    <a className="border p-4 flex flex-col">
      <p>
        {' '}
        <span className="font-semibold text-gray-600">ID: </span>{' '}
        <span className="font-bold text-gray-800">{match._id}</span>
      </p>
      <p>
        <span className="font-semibold text-gray-600">Created By:</span>{' '}
        <span className="font-bold text-gray-800">
          {match.createdBy.email}{' '}
        </span>
      </p>
      <p>
        <span className="font-semibold text-gray-600">Player 1: </span>{' '}
        <span className="font-bold text-gray-800">
          {match.white.user ? match.white.user.email : 'No Player'}
        </span>
      </p>
      <p>
        <span className="font-semibold text-gray-600">Player 2: </span>{' '}
        <span className="font-bold text-gray-800">
          {match.black.user ? match.black.user.email : 'No Player'}
        </span>
      </p>
      <p>
        <span className="font-semibold text-gray-600">Created At: </span>{' '}
        <span className="font-bold text-gray-800">
          {dayjs(match.createdAt).fromNow()}{' '}
        </span>
      </p>
    </a>
  );

  const renderMatches = () => (
    <div>
      {matches.map(match => (
        <div key={match._id} className="p-4 text-center mb-4">
          {renderMatch(match)}
          {renderJoinButton(match)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <button
        className="cursor-pointer text-blue-300 mb-4"
        onClick={createMatch}
      >
        Create Match
      </button>
      {renderMatches()}
    </div>
  );
};

Page.getInitialProps = async ctx => {
  const {
    data: { data: matches },
  } = await axios.get(`${process.env.API_URL}/v1/matches`);

  return { matches };
};

const mapStateToProps = state => state;

export default defaultLayout(
  connect(
    mapStateToProps,
    null
  )(Page)
);
