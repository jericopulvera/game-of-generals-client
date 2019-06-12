import axios from 'axios';
import defaultLayout from '@layouts/defaultLayout';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import Router from 'next/router';

dayjs.extend(relativeTime);

const Page = props => {
  const { matches, user: authenticatedUser } = props;

  const createMatch = async e => {
    e.preventDefault();

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
    <Link
      href={`/matches/_matchId?matchId=${match._id}`}
      as={`/matches/${match._id}`}
      prefetch
      passHref
    >
      <a className="border p-4 flex flex-col">
        <span>ID: {match._id}</span>
        <span>Created By: {match.createdBy.email} </span>
        <span>
          Player 1: {match.white.user ? match.white.user.email : 'No Player'}
        </span>
        <span>
          Player 2: {match.black.user ? match.black.user.email : 'No Player'}
        </span>
        <span>Created At: {dayjs(match.createdAt).fromNow()} </span>
      </a>
    </Link>
  );

  if (!authenticatedUser) {
    return (
      <div className="flex flex-col items-center">Login to view matches</div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        className="cursor-pointer text-blue-300 mb-4"
        onClick={createMatch}
      >
        Create Match
      </button>
      <div>
        {matches.map(match => (
          <div key={match._id} className="p-4 text-center mb-4">
            {renderMatch(match)}
            {renderJoinButton(match)}
          </div>
        ))}
      </div>
    </div>
  );
};

Page.getInitialProps = async ctx => {
  const {
    data: { data: matches },
  } = await axios.get(`${process.env.API_URL}/v1/my-matches`);

  return { matches };
};

const mapStateToProps = state => state;

export default defaultLayout(
  connect(
    mapStateToProps,
    null
  )(Page)
);
