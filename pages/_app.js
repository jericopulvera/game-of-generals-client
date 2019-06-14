import '@styles/index.css';

import React, { useState, useEffect } from 'react';
import { Container } from 'next/app';
import NProgress from 'nprogress';
import Router from 'next/router';
import withReduxStore from '@lib/with-redux-store';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import { parseCookies } from 'nookies';

Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const useSocketConnect = (token, setSocket) => {
  useEffect(() => {
    const socket = io(process.env.API_URL, {
      transports: ['websocket'],
      query: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    setSocket(socket);
    return () => socket.close();
  }, [token, setSocket]);
};

const MyApp = props => {
  const { Component, pageProps, reduxStore } = props;
  const { token } = parseCookies(props);
  const [socket, setSocket] = useState(null);

  useSocketConnect(token, setSocket);

  return (
    <Container>
      <Provider store={reduxStore}>
        <Component {...pageProps} socket={socket} />
      </Provider>
    </Container>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default withReduxStore(MyApp);
