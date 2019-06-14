import axios from 'axios';
import defaultLayout from '@layouts/defaultLayout';
import { connect } from 'react-redux';
import Board from '@components/Board';
import Error from '../_error';

const Page = props => {
  const { match } = props;

  if (!match) {
    return <Error statusCode={props.statusCode} />;
  }

  return (
    <div>
      <Board match={match} {...props} />
    </div>
  );
};

Page.getInitialProps = async ctx => {
  try {
    const {
      data: { data: match },
    } = await axios.get(
      `${process.env.API_URL}/v1/matches/${ctx.query.matchId}`
    );

    if (!match) {
      return { statusCode: 404, match };
    }

    return { match };
  } catch (error) {
    return {
      statusCode: error.response.status,
      message: error.response.message,
    };
  }
};

const mapStateToProps = state => state;

export default defaultLayout(
  connect(
    mapStateToProps,
    null
  )(Page)
);
