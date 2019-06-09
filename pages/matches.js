import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultLayout from '@layouts/defaultLayout';
import { connect } from 'react-redux';
import Board from '../components/Board';

const Page = props => {
  const { match } = props;

  return (
    <div>
      <Board match={match} {...props} />
    </div>
  );
};

Page.getInitialProps = async ctx => {
  const {
    data: { data: match },
  } = await axios.get(
    'http://localhost:3333/v1/matches/5cfbab1026dacc01e766a5da'
  );

  return { match };
};

const mapStateToProps = state => state;

export default defaultLayout(
  connect(
    mapStateToProps,
    null
  )(Page)
);
