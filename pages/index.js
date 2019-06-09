// import React, { useEffect } from 'react';
import React from 'react';
import defaultLayout from '@layouts/defaultLayout';
// import io from 'socket.io-client';
// import { parseCookies } from 'nookies';
import { connect } from 'react-redux';

const Page = () => (
  // const { token } = parseCookies(props);

  // useEffect(() => {
  //   io(process.env.API_URL, {
  //     transports: ['websocket'],
  //     query: {
  //       token,
  //     },
  //   });
  // }, [token]);

  <div className="text-center">Home Page</div>
);
const mapStateToProps = state => state;

export default defaultLayout(
  connect(
    mapStateToProps,
    null
  )(Page)
);
